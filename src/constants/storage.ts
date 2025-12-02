// API Endpoints
export const API_ENDPOINTS = {
  EQUIPMENT: '/api/equipment',
  JSONBIN_BASE: 'https://api.jsonbin.io/v3',
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  VIEW_MODE: 'equipment-view-mode',
  THEME: 'theme',
} as const

// Emissions Units
export const EMISSIONS_UNITS = {
  KG_CO2E: 'kgCO₂e',
  T_CO2E: 'tCO₂e',
} as const

// Conversion Factors
export const CONVERSION_FACTORS = {
  KG_TO_TONS: 1000,
} as const
