"use client"

import * as React from "react"
import { Plane, Clock, Info, Edit3, MapPin, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Flight, TravelClass } from "@/lib/types"

interface FlightCardProps {
  flight: Flight
  onUpdate: (updatedFlight: Flight) => void
}

export function FlightCard({ flight, onUpdate }: FlightCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)

  // Local state for editing
  const [editPrice, setEditPrice] = React.useState(flight.price)
  const [editSeats, setEditSeats] = React.useState(flight.seatsAvailable)
  const [editClass, setEditClass] = React.useState<TravelClass>(flight.class)

  const handleSaveEdit = () => {
    onUpdate({
      ...flight,
      price: editPrice,
      seatsAvailable: editSeats,
      class: editClass,
    })
    setIsEditOpen(false)
  }

  return (
    <Card className="group overflow-hidden border border-border/40 bg-gradient-to-br from-card to-card/80 shadow-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 rounded-2xl hover:border-primary/40 hover:-translate-y-0.5">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          {/* Main Flight Content */}
          <div className="flex-1 p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-5 lg:gap-8">
              {/* Airline Info */}
              <div className="flex items-center gap-3.5 min-w-[160px]">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative h-12 w-12 bg-gradient-to-br from-primary/15 to-primary/5 rounded-xl flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform duration-300">
                    <Plane className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="font-bold text-base text-foreground leading-none">{flight.airline}</p>
                  <Badge className="text-[9px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-md bg-accent/15 text-accent border border-accent/30 w-fit">
                    {flight.class}
                  </Badge>
                </div>
              </div>

              {/* Route */}
              <div className="flex-1 flex items-center gap-3 lg:gap-6 w-full">
                {/* Departure */}
                <div className="flex-1 min-w-0">
                  <p className="text-3xl font-black tabular-nums tracking-tight text-foreground leading-none mb-2">
                    {flight.departureTime}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border-border/60">
                      {flight.origin}
                    </Badge>
                  </div>
                </div>

                {/* Route Line */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0 px-2">
                  <div className="flex items-center w-full min-w-[80px] lg:min-w-[120px]">
                    <div className="h-[2px] bg-gradient-to-r from-transparent via-border to-border flex-1" />
                    <div className="mx-2 relative">
                      <div className="absolute inset-0 bg-primary/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative bg-gradient-to-br from-primary/20 to-primary/10 p-2 rounded-full border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                        <Plane className="h-3.5 w-3.5 text-primary rotate-90" />
                      </div>
                    </div>
                    <div className="h-[2px] bg-gradient-to-l from-transparent via-border to-border flex-1" />
                  </div>
                  <div className="text-center space-y-0.5">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                      {flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                    </p>
                    <div className="flex items-center justify-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{flight.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Arrival */}
                <div className="flex-1 min-w-0 text-right">
                  <p className="text-3xl font-black tabular-nums tracking-tight text-foreground leading-none mb-2">
                    {flight.arrivalTime}
                  </p>
                  <div className="flex items-center gap-1.5 justify-end">
                    <Badge variant="outline" className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border-border/60">
                      {flight.destination}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price & Actions Sidebar */}
          <div className="lg:w-56 border-t lg:border-t-0 lg:border-l border-border/40 bg-gradient-to-br from-muted/30 to-muted/10 p-6 flex flex-row lg:flex-col justify-between lg:justify-center items-center lg:items-stretch gap-5">
            {/* Price */}
            <div className="text-center lg:text-left flex-1 lg:flex-none">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Total Price
              </p>
              <div className="flex items-baseline justify-center lg:justify-start gap-1.5 mb-3">
                <span className="text-lg font-bold text-muted-foreground">$</span>
                <p className="text-4xl font-black tracking-tight text-foreground tabular-nums leading-none">
                  {flight.price.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-muted-foreground pt-3 border-t border-border/40">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-semibold">{flight.seatsAvailable} seats left</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 min-w-[110px] lg:min-w-0 lg:w-full">
              <Button
                onClick={() => setIsDetailsOpen(true)}
                size="sm"
                className="w-full h-10 rounded-lg text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Info className="h-4 w-4 mr-2" />
                View Details
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditOpen(true)}
                className="w-full h-10 rounded-lg text-xs font-bold border-2 border-border/60 hover:bg-accent/10 hover:border-accent/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Modify
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-xl rounded-xl p-0 overflow-hidden border shadow-xl">
          <div className="bg-primary p-6 text-primary-foreground">
            <DialogHeader>
              <DialogTitle className="text-xl font-black tracking-tight">Flight Details</DialogTitle>
              <DialogDescription className="text-primary-foreground/80 font-medium text-sm mt-1">
                Complete flight information
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-6 space-y-6 bg-background">
            {/* Flight Header */}
            <div className="flex justify-between items-center pb-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
                  <Plane className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-base leading-tight">{flight.airline}</p>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mt-0.5">
                    ID: {flight.id.slice(0, 8)}
                  </p>
                </div>
              </div>
              <Badge className="text-[10px] font-semibold uppercase tracking-wide py-1 px-3 rounded-full bg-accent/15 text-accent border border-accent/20">
                {flight.class}
              </Badge>
            </div>

            {/* Route Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 p-4 rounded-lg bg-muted/30 border border-border/40">
                <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  Departure
                </Label>
                <p className="text-2xl font-black tracking-tight leading-none">{flight.departureTime}</p>
                <div className="flex items-center gap-1.5 pt-1">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-xs font-semibold text-muted-foreground">{flight.origin}</p>
                </div>
              </div>
              <div className="space-y-2 p-4 rounded-lg bg-muted/30 border border-border/40">
                <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  Arrival
                </Label>
                <p className="text-2xl font-black tracking-tight leading-none">{flight.arrivalTime}</p>
                <div className="flex items-center gap-1.5 pt-1">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-xs font-semibold text-muted-foreground">{flight.destination}</p>
                </div>
              </div>
            </div>

            {/* Flight Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-muted/20 p-4 rounded-lg text-center space-y-1.5 border border-border/40">
                <Clock className="h-4 w-4 text-primary mx-auto" />
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Duration</p>
                <p className="text-sm font-black">{flight.duration}</p>
              </div>
              <div className="bg-muted/20 p-4 rounded-lg text-center space-y-1.5 border border-border/40">
                <Plane className="h-4 w-4 text-accent mx-auto" />
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Stops</p>
                <p className="text-sm font-black">{flight.stops === 0 ? "Direct" : `${flight.stops}`}</p>
              </div>
              <div className="bg-muted/20 p-4 rounded-lg text-center space-y-1.5 border border-border/40">
                <div className="h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Available</p>
                <p className="text-sm font-black">{flight.seatsAvailable}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden border shadow-xl">
          <div className="bg-accent/10 p-6 border-b border-border/40">
            <DialogHeader>
              <DialogTitle className="text-lg font-black tracking-tight">Modify Flight</DialogTitle>
              <DialogDescription className="font-medium text-muted-foreground text-sm mt-1">
                Update flight parameters
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-6 space-y-4 bg-background">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Price (USD)
              </Label>
              <Input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(Number(e.target.value))}
                className="h-11 rounded-lg border font-semibold focus:border-primary transition-colors"
                placeholder="Enter price"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Available Seats
              </Label>
              <Input
                type="number"
                value={editSeats}
                onChange={(e) => setEditSeats(Number(e.target.value))}
                className="h-11 rounded-lg border font-semibold focus:border-primary transition-colors"
                placeholder="Enter seat count"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Travel Class
              </Label>
              <Select value={editClass} onValueChange={(v: TravelClass) => setEditClass(v)}>
                <SelectTrigger className="h-11 rounded-lg border font-semibold focus:border-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  <SelectItem value="Economy">Economy</SelectItem>
                  <SelectItem value="Premium Economy">Premium Economy</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="First">First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="p-6 pt-0 flex gap-3">
            <Button 
              variant="ghost" 
              className="rounded-lg font-semibold px-6 h-10 hover:bg-muted" 
              onClick={() => setIsEditOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEdit} 
              className="rounded-lg font-bold px-8 h-10 bg-accent hover:bg-accent/90 shadow-sm"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
