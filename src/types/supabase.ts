export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          organization_id: string | null
          role: 'owner' | 'admin' | 'member'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          organization_id?: string | null
          role?: 'owner' | 'admin' | 'member'
        }
        Update: {
          email?: string
          full_name?: string | null
          organization_id?: string | null
          role?: 'owner' | 'admin' | 'member'
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          }
        ]
      }
      equipment: {
        Row: {
          id: string
          organization_id: string
          name: string
          equipment_id: string | null
          manufacturer: string
          type: string
          daily_emissions_value: number
          daily_emissions_unit: string
          category: 'wet-lab' | 'dry-lab' | null
          image_url: string | null
          is_active: boolean
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          equipment_id?: string | null
          manufacturer: string
          type: string
          daily_emissions_value: number
          daily_emissions_unit?: string
          category?: 'wet-lab' | 'dry-lab' | null
          image_url?: string | null
          is_active?: boolean
          created_by?: string | null
        }
        Update: {
          name?: string
          equipment_id?: string | null
          manufacturer?: string
          type?: string
          daily_emissions_value?: number
          daily_emissions_unit?: string
          category?: 'wet-lab' | 'dry-lab' | null
          image_url?: string | null
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'equipment_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          }
        ]
      }
      daily_emissions: {
        Row: {
          id: string
          organization_id: string
          equipment_id: string
          date: string
          emissions_value: number
          emissions_unit: string
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          equipment_id: string
          date: string
          emissions_value: number
          emissions_unit?: string
        }
        Update: {
          emissions_value?: number
          emissions_unit?: string
        }
        Relationships: [
          {
            foreignKeyName: 'daily_emissions_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'daily_emissions_equipment_id_fkey'
            columns: ['equipment_id']
            isOneToOne: false
            referencedRelation: 'equipment'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_organization_id: {
        Args: Record<string, never>
        Returns: string | null
      }
      get_daily_aggregates: {
        Args: {
          p_organization_id: string
          p_days?: number
        }
        Returns: {
          date: string
          total_emissions: number
          equipment_count: number
        }[]
      }
      get_weekly_aggregates: {
        Args: {
          p_organization_id: string
          p_weeks?: number
        }
        Returns: {
          week_number: number
          year: number
          week_name: string
          total_emissions: number
          equipment_count: number
        }[]
      }
      get_monthly_aggregates: {
        Args: {
          p_organization_id: string
          p_months?: number
        }
        Returns: {
          month_number: number
          year: number
          month_name: string
          total_emissions: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

export type Organization = Tables<'organizations'>
export type Profile = Tables<'profiles'>
export type DbEquipment = Tables<'equipment'>
export type DailyEmission = Tables<'daily_emissions'>
