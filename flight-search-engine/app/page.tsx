"use client"

import * as React from "react"
import { SlidersHorizontal, Loader2, PlaneTakeoff, Info } from "lucide-react"
import { FlightSearchForm } from "@/components/flight-search-form"
import { FlightCard } from "@/components/flight-card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import type { Flight, SearchParams, TravelClass } from "@/lib/types"
import { 
  searchFlights, 
  formatDuration, 
  formatTime, 
  getTotalDurationMinutes,
  type AmadeusFlightOffer 
} from "@/lib/api"

// Convert Amadeus flight offer to our Flight type
function convertAmadeusToFlight(offer: AmadeusFlightOffer): Flight {
  const outbound = offer.itineraries[0]
  const firstSegment = outbound.segments[0]
  const lastSegment = outbound.segments[outbound.segments.length - 1]
  
  return {
    id: offer.id,
    airline: offer.validatingAirlineCodes[0] || firstSegment.carrierCode,
    logo: "",
    departureTime: formatTime(firstSegment.departure.at),
    arrivalTime: formatTime(lastSegment.arrival.at),
    duration: formatDuration(outbound.duration),
    origin: firstSegment.departure.iataCode,
    destination: lastSegment.arrival.iataCode,
    price: Math.round(offer.price.total),
    stops: outbound.segments.length - 1,
    class: (offer.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin || "Economy") as TravelClass,
    seatsAvailable: offer.numberOfBookableSeats,
  }
}

export default function FlightEnginePage() {
  const [flights, setFlights] = React.useState<Flight[]>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const [sortBy, setSortBy] = React.useState("price-asc")
  const [directOnly, setDirectOnly] = React.useState(false)
  const [maxPrice, setMaxPrice] = React.useState([2000])
  const [hasSearched, setHasSearched] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSearch = async (params: SearchParams) => {
    if (!params.origin || !params.destination || !params.departureDate) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSearching(true)
    setHasSearched(true)
    setError(null)

    try {
      // Map travel class to Amadeus format
      const travelClassMap: Record<TravelClass, string> = {
        "Economy": "ECONOMY",
        "Premium Economy": "PREMIUM_ECONOMY",
        "Business": "BUSINESS",
        "First": "FIRST"
      }

      const response = await searchFlights({
        searchRequest: {
          originLocationCode: params.origin,
          destinationLocationCode: params.destination,
          departureDate: params.departureDate.toISOString().split('T')[0],
          returnDate: params.returnDate?.toISOString().split('T')[0],
          adults: params.passengers,
          travelClass: travelClassMap[params.travelClass],
          currencyCode: "USD",
          maxResults: 50,
        },
        filterOptions: {
          directFlightsOnly: directOnly,
          // Don't filter by maxPrice on backend - let client-side slider handle it
          // maxPrice: maxPrice[0],
        },
        sortBy: sortBy,
      })

      const convertedFlights = response.data.map(convertAmadeusToFlight)
      setFlights(convertedFlights)
      
      if (convertedFlights.length === 0) {
        toast.info("No flights found. Try adjusting your search criteria.")
      } else {
        toast.success(`Found ${convertedFlights.length} flight${convertedFlights.length > 1 ? 's' : ''}`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to search flights"
      setError(errorMessage)
      toast.error(errorMessage)
      console.error("Search error:", err)
    } finally {
      setIsSearching(false)
    }
  }

  const handleUpdateFlight = (updatedFlight: Flight) => {
    setFlights((prev) => prev.map((f) => (f.id === updatedFlight.id ? updatedFlight : f)))
    toast.success("Flight updated successfully")
  }

  const filteredAndSortedFlights = React.useMemo(() => {
    let result = [...flights]

    // Filters
    if (directOnly) result = result.filter((f) => f.stops === 0)
    result = result.filter((f) => f.price <= maxPrice[0])

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price
      if (sortBy === "price-desc") return b.price - a.price
      if (sortBy === "duration-asc") {
        const aDur = getTotalDurationMinutes(a.duration)
        const bDur = getTotalDurationMinutes(b.duration)
        return aDur - bDur
      }
      if (sortBy === "duration-desc") {
        const aDur = getTotalDurationMinutes(a.duration)
        const bDur = getTotalDurationMinutes(b.duration)
        return bDur - aDur
      }
      if (sortBy === "departure-early") return a.departureTime.localeCompare(b.departureTime)
      if (sortBy === "departure-late") return b.departureTime.localeCompare(a.departureTime)
      return 0
    })

    return result
  }, [flights, sortBy, directOnly, maxPrice])

  return (
    <main className="min-h-screen pb-20 bg-[oklch(0.99_0.005_220)] selection:bg-accent/30">
      <div className="bg-primary text-primary-foreground pt-32 pb-60 px-4 relative overflow-hidden">
        {/* Dynamic decorative background elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-accent/20 rounded-full blur-[120px] pointer-events-none opacity-50" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-primary-foreground/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-4 backdrop-blur-md">
            <PlaneTakeoff className="h-3.5 w-3.5 text-accent" />
            Discover the World
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-[-0.05em] leading-[0.85] max-w-5xl mx-auto uppercase">
            Elevated <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-white to-white/80">
              Flight Search.
            </span>
          </h1>
          <p className="text-primary-foreground/60 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed tracking-tight">
            Seamlessly find, compare, and modify routes with our intuitive <br className="hidden md:block" />
            next-generation travel companion powered by Amadeus.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-40 relative z-20">
        <FlightSearchForm onSearch={handleSearch} />
      </div>

      <div className={`max-w-6xl mx-auto px-4 mt-20 ${hasSearched ? 'grid grid-cols-1 lg:grid-cols-4 gap-12' : ''}`}>
        {hasSearched && (
          <aside className="space-y-10 lg:sticky lg:top-10 self-start">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">Refine Results</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDirectOnly(false)
                    setMaxPrice([2000])
                  }}
                  className="h-auto p-0 text-accent font-bold hover:bg-transparent hover:text-accent/80 transition-colors"
                >
                  Clear Filters
                </Button>
              </div>
              <Separator className="bg-border/60" />
            </div>

            <div className="space-y-8">
              <div className="flex items-center space-x-3 group cursor-pointer">
                <Checkbox
                  id="direct"
                  checked={directOnly}
                  onCheckedChange={(v) => setDirectOnly(!!v)}
                  className="w-5 h-5 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                />
                <Label
                  htmlFor="direct"
                  className="font-semibold text-sm cursor-pointer group-hover:text-accent transition-colors"
                >
                  Direct flights only
                </Label>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <Label className="font-bold text-sm">Budget Range</Label>
                    <p className="text-xs text-muted-foreground">Adjust to fit your needs</p>
                  </div>
                  <span className="text-xl font-black text-accent tabular-nums">${maxPrice[0]}</span>
                </div>
                <Slider value={maxPrice} max={3000} step={50} onValueChange={setMaxPrice} className="py-2" />
              </div>
            </div>

            <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10 space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Info className="h-4 w-4" />
                <span className="text-xs font-black uppercase tracking-widest">Travel Insights</span>
              </div>
              <p className="text-xs leading-relaxed font-medium text-muted-foreground">
                Powered by Amadeus API. Real-time flight data from airlines worldwide.
              </p>
            </div>
          </aside>
        )}

        <div className={hasSearched ? "lg:col-span-3 space-y-8" : "space-y-8"}>
          {!hasSearched ? (
            <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full scale-150" />
                <div className="h-24 w-24 bg-card rounded-3xl shadow-xl flex items-center justify-center border relative z-10 rotate-3 transition-transform hover:rotate-0">
                  <PlaneTakeoff className="h-10 w-10 text-accent" />
                </div>
              </div>
              <div className="space-y-2 max-w-sm">
                <h3 className="text-2xl font-black tracking-tight">Ready for takeoff?</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  Enter your destination to explore thousands of flights curated just for you.
                </p>
              </div>
            </div>
          ) : isSearching ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <div className="relative">
                <Loader2 className="h-16 w-16 text-accent animate-spin" />
                <PlaneTakeoff className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-bold text-lg tracking-tight">Searching the globe...</p>
                <p className="text-sm text-muted-foreground">Finding the best rates and connections via Amadeus.</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-32 bg-card rounded-[2rem] border-2 border-dashed border-destructive/60">
              <div className="bg-destructive/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <SlidersHorizontal className="h-8 w-8 text-destructive" />
              </div>
              <p className="text-xl font-bold tracking-tight text-destructive">Search Error</p>
              <p className="text-muted-foreground mt-2 max-w-xs mx-auto">{error}</p>
              <Button
                variant="outline"
                className="mt-8 rounded-full font-bold px-8"
                onClick={() => {
                  setError(null)
                  setHasSearched(false)
                }}
              >
                Try Again
              </Button>
            </div>
          ) : filteredAndSortedFlights.length > 0 ? (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">Available Flights</h2>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {filteredAndSortedFlights.length} premium options found
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-card px-3 py-1.5 rounded-full border shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                    Sort
                  </span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[160px] h-7 border-none shadow-none focus:ring-0 text-xs font-black p-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="duration-asc">Duration: Shortest</SelectItem>
                      <SelectItem value="duration-desc">Duration: Longest</SelectItem>
                      <SelectItem value="departure-early">Departure: Early</SelectItem>
                      <SelectItem value="departure-late">Departure: Late</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                {filteredAndSortedFlights.map((flight) => (
                  <FlightCard key={flight.id} flight={flight} onUpdate={handleUpdateFlight} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-32 bg-card rounded-[2rem] border-2 border-dashed border-border/60">
              <div className="bg-muted h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <SlidersHorizontal className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-xl font-bold tracking-tight">No matching flights</p>
              <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
                Try adjusting your filters or search parameters to see more results.
              </p>
              <Button
                variant="outline"
                className="mt-8 rounded-full font-bold px-8 border-accent text-accent hover:bg-accent hover:text-white bg-transparent"
                onClick={() => {
                  setDirectOnly(false)
                  setMaxPrice([2000])
                }}
              >
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

