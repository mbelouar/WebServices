export type TripType = "round-trip" | "one-way"
export type TravelClass = "Economy" | "Premium Economy" | "Business" | "First"

export interface Flight {
  id: string
  airline: string
  logo: string
  departureTime: string
  arrivalTime: string
  duration: string
  origin: string
  destination: string
  price: number
  stops: number
  class: TravelClass
  seatsAvailable: number
}

export interface SearchParams {
  tripType: TripType
  origin: string
  destination: string
  departureDate: Date | undefined
  returnDate: Date | undefined
  passengers: number
  travelClass: TravelClass
}
