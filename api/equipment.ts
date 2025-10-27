import type { VercelRequest, VercelResponse } from '@vercel/node'

// JSONBin configuration (server-side only)
const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID
const JSONBIN_MASTER_KEY = process.env.JSONBIN_MASTER_KEY

interface JSONBinExperiment {
  id: string
  project_name: string
  experiment_description: string
  epoch: number | null
  start_time: string
  'duration(s)': number
  'power_consumption(kWh)': number
  'CO2_emissions(kg)': number
  CPU_name: string
  GPU_name: string
  OS: string
  'region/country': string
  cost: number
}

interface JSONBinResponse {
  record: JSONBinExperiment[]
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Check if environment variables are set
  if (!JSONBIN_BIN_ID || !JSONBIN_MASTER_KEY) {
    console.error('Missing environment variables')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  try {
    // Fetch data from JSONBin
    const response = await fetch(
      `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`,
      {
        method: 'GET',
        headers: {
          'X-Master-Key': JSONBIN_MASTER_KEY,
          'X-Access-Key': JSONBIN_MASTER_KEY,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`JSONBin API error: ${response.status}`)
    }

    const data: JSONBinResponse = await response.json()

    // Return the experiments data
    return res.status(200).json({
      success: true,
      data: data.record,
    })
  } catch (error) {
    console.error('Failed to fetch from JSONBin:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch equipment data',
    })
  }
}
