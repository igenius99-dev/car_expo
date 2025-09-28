// CarCard.types.ts

export interface Car {
  id: string

  // Basic info
  make: string
  model: string
  year: number
  price: number
  image: string
  type: string // sedan, suv, ev, etc

  // Optional details
  range?: number // for EVs
  mileage?: string
  location?: string
  dealer?: string
  trim?: string
  exterior_color?: string
  interior_color?: string
  engine?: string
  transmission?: string
  drivetrain?: string
  fuel_type?: string // e.g. "Gasoline", "Electric"
  body_style?: string
  displacement?: string

  // Extra condition / safety indicators
  no_accidents?: boolean
  service_records?: boolean
  vehicle_condition?: string

  // Financial info
  monthly_payment?: {
    amount: number
    down_payment: number
    loan_amount: number
    interest_rate: number
    term_months: number
  }

  // Dealer info
  dealer_rating?: number
  dealer_review_count?: number

  // Performance / efficiency
  mpg_city?: string
  mpg_highway?: string

  // Additional features/specs (chips in UI)
  top_options?: string[]

  // Links
  listing_url?: string
}
