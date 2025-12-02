import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client with service key
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY
const cronSecret = process.env.CRON_SECRET

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Verify the request is from Vercel Cron
  const authHeader = req.headers.authorization
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // Check environment variables
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    const today = new Date().toISOString().split('T')[0]

    // Get all organizations
    const { data: organizations, error: orgError } = await supabase
      .from('organizations')
      .select('id')

    if (orgError) {
      throw new Error(`Failed to fetch organizations: ${orgError.message}`)
    }

    if (!organizations || organizations.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No organizations to process',
        recorded: 0,
      })
    }

    let recordedCount = 0
    const errors: string[] = []

    // Process each organization
    for (const org of organizations) {
      try {
        // Get active equipment for this organization
        const { data: equipment, error: eqError } = await supabase
          .from('equipment')
          .select('id, daily_emissions_value')
          .eq('organization_id', org.id)
          .eq('is_active', true)

        if (eqError) {
          errors.push(`Org ${org.id}: ${eqError.message}`)
          continue
        }

        if (!equipment || equipment.length === 0) {
          continue
        }

        // Check if we already recorded for today
        const { data: existing } = await supabase
          .from('daily_emissions')
          .select('id')
          .eq('organization_id', org.id)
          .eq('date', today)
          .limit(1)

        if (existing && existing.length > 0) {
          // Already recorded for today, skip
          continue
        }

        // Create daily emissions records for each equipment
        const records = equipment.map((eq) => ({
          organization_id: org.id,
          equipment_id: eq.id,
          date: today,
          emissions_value: eq.daily_emissions_value || 0,
          emissions_unit: 'kgCO₂e',
        }))

        const { error: insertError } = await supabase
          .from('daily_emissions')
          .insert(records)

        if (insertError) {
          errors.push(`Org ${org.id} insert: ${insertError.message}`)
          continue
        }

        recordedCount += records.length
      } catch (err) {
        errors.push(`Org ${org.id}: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }

    return res.status(200).json({
      success: true,
      message: `Recorded daily emissions for ${recordedCount} equipment items`,
      recorded: recordedCount,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Cron job failed:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to record emissions',
    })
  }
}
