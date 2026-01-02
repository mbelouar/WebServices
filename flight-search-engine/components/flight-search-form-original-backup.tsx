"use client"

import * as React from "react"
import { CalendarIcon, Plane, MapPin, Users } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import type { SearchParams, TripType, TravelClass } from "@/lib/types"

const AIRPORTS = [
  { code: "CDG", city: "Paris", name: "Charles de Gaulle" },
  { code: "LHR", city: "London", name: "Heathrow" },
  { code: "JFK", city: "New York", name: "John F. Kennedy" },
  { code: "HND", city: "Tokyo", name: "Haneda" },
  { code: "DXB", city: "Dubai", name: "Dubai International" },
]

interface FlightSearchFormProps {
  onSearch: (params: SearchParams) => void
}

export function FlightSearchForm({ onSearch }: FlightSearchFormProps) {
  const [tripType, setTripType] = React.useState<TripType>("round-trip")
  const [origin, setOrigin] = React.useState("")
  const [destination, setDestination] = React.useState("")
  const [departureDate, setDepartureDate] = React.useState<Date>()
  const [returnDate, setReturnDate] = React.useState<Date>()
  const [passengers, setPassengers] = React.useState(1)
  const [travelClass, setTravelClass] = React.useState<TravelClass>("Economy")

  const handleSearch = () => {
    onSearch({
      tripType,
      origin,
      destination,
      departureDate,
      returnDate,
      passengers,
      travelClass,
    })
  }

  return (
    <div className="bg-card p-2 rounded-[2rem] shadow-2xl border border-white/20">
      <div className="bg-background rounded-[1.8rem] p-6 lg:p-8 space-y-8">
        <div className="flex flex-wrap gap-6 items-center border-b border-border/40 pb-6">
          <Select value={tripType} onValueChange={(v: TripType) => setTripType(v)}>
            <SelectTrigger className="w-auto gap-3 border-none shadow-none focus:ring-0 font-bold text-sm px-0 h-auto uppercase tracking-wider">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/60">
              <SelectItem value="round-trip">Round-trip</SelectItem>
              <SelectItem value="one-way">One-way</SelectItem>
            </SelectContent>
          </Select>

          <Select value={String(passengers)} onValueChange={(v) => setPassengers(Number(v))}>
            <SelectTrigger className="w-auto gap-3 border-none shadow-none focus:ring-0 font-bold text-sm px-0 h-auto uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-accent" />
                <span>
                  {passengers} Traveler{passengers > 1 ? "s" : ""}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/60">
              {[1, 2, 3, 4, 5].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} traveler{n > 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={travelClass} onValueChange={(v: TravelClass) => setTravelClass(v)}>
            <SelectTrigger className="w-auto gap-3 border-none shadow-none focus:ring-0 font-bold text-sm px-0 h-auto uppercase tracking-wider">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/60">
              <SelectItem value="Economy">Economy</SelectItem>
              <SelectItem value="Premium Economy">Premium Economy</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
              <SelectItem value="First">First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-px bg-border/40 rounded-2xl overflow-hidden border border-border/40">
          <div className="lg:col-span-3 bg-background p-4 space-y-2 hover:bg-muted/30 transition-colors">
            <Label className="text-[10px] text-muted-foreground uppercase font-black tracking-widest flex items-center gap-2">
              <Plane className="h-3 w-3 rotate-45 text-accent" />
              Origin
            </Label>
            <AirportAutocomplete
              placeholder="Leaving from"
              value={origin}
              onChange={setOrigin}
              className="border-none p-0 h-auto shadow-none font-bold text-lg"
            />
          </div>

          <div className="lg:col-span-3 bg-background p-4 space-y-2 hover:bg-muted/30 transition-colors">
            <Label className="text-[10px] text-muted-foreground uppercase font-black tracking-widest flex items-center gap-2">
              <MapPin className="h-3 w-3 text-accent" />
              Destination
            </Label>
            <AirportAutocomplete
              placeholder="Going to"
              value={destination}
              onChange={setDestination}
              className="border-none p-0 h-auto shadow-none font-bold text-lg"
            />
          </div>

          <div className="lg:col-span-3 bg-background p-4 space-y-2 hover:bg-muted/30 transition-colors">
            <Label className="text-[10px] text-muted-foreground uppercase font-black tracking-widest flex items-center gap-2">
              <CalendarIcon className="h-3 w-3 text-accent" />
              Departure
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left font-bold text-lg p-0 h-auto hover:bg-transparent",
                    !departureDate && "text-muted-foreground",
                  )}
                >
                  {departureDate ? format(departureDate, "MMM dd, yyyy") : <span>Set Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={departureDate} onSelect={setDepartureDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div
            className={cn(
              "lg:col-span-3 bg-background p-4 space-y-2 hover:bg-muted/30 transition-colors",
              tripType === "one-way" && "opacity-40 cursor-not-allowed",
            )}
          >
            <Label className="text-[10px] text-muted-foreground uppercase font-black tracking-widest flex items-center gap-2">
              <CalendarIcon className="h-3 w-3 text-accent" />
              Return
            </Label>
            <Popover>
              <PopoverTrigger asChild disabled={tripType === "one-way"}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left font-bold text-lg p-0 h-auto hover:bg-transparent",
                    !returnDate && "text-muted-foreground",
                  )}
                >
                  {returnDate ? format(returnDate, "MMM dd, yyyy") : <span>Set Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  initialFocus
                  disabled={(date) => !!departureDate && date < departureDate}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 gap-4">
          <p className="text-xs text-muted-foreground font-medium italic">
            * Prices are estimated based on current demand.
          </p>
          <Button
            onClick={handleSearch}
            className="w-full sm:w-auto px-12 h-14 text-lg font-black rounded-full bg-accent hover:bg-accent/90 text-white shadow-xl shadow-accent/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Search Flights
          </Button>
        </div>
      </div>
    </div>
  )
}

function AirportAutocomplete({
  placeholder,
  value,
  onChange,
  className,
}: {
  placeholder: string
  value: string
  onChange: (v: string) => void
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState(value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-start text-left font-bold h-auto hover:bg-transparent px-0", className)}
        >
          <span className="truncate">{inputValue || placeholder}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0 rounded-2xl shadow-2xl border-border/60" align="start">
        <Command className="rounded-2xl">
          <CommandInput
            placeholder="Search cities or airports..."
            className="h-14 font-medium"
            onValueChange={(v) => {}}
          />
          <CommandList className="max-h-[300px]">
            <CommandEmpty className="py-6 text-center text-sm font-medium">No results found.</CommandEmpty>
            <CommandGroup heading="Popular Destinations" className="p-2">
              {AIRPORTS.map((airport) => (
                <CommandItem
                  key={airport.code}
                  value={`${airport.city} ${airport.code}`}
                  onSelect={() => {
                    const label = `${airport.city} (${airport.code})`
                    setInputValue(label)
                    onChange(airport.code)
                    setOpen(false)
                  }}
                  className="rounded-xl flex flex-col items-start gap-1 py-3 px-4"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-[10px] font-black uppercase">
                      {airport.code}
                    </div>
                    <span className="font-bold text-sm">{airport.city}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium pl-12 uppercase tracking-tight">
                    {airport.name}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
