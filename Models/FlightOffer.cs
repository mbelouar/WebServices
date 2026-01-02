namespace FlightSearchEngine.Models;

public class FlightOffer
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Source { get; set; } = string.Empty;
    public bool InstantTicketingRequired { get; set; }
    public bool NonHomogeneous { get; set; }
    public bool OneWay { get; set; }
    public string LastTicketingDate { get; set; } = string.Empty;
    public int NumberOfBookableSeats { get; set; }
    public List<Itinerary> Itineraries { get; set; } = new();
    public Price Price { get; set; } = new();
    public PricingOptions PricingOptions { get; set; } = new();
    public List<string> ValidatingAirlineCodes { get; set; } = new();
    public List<TravelerPricing> TravelerPricings { get; set; } = new();
}

public class Itinerary
{
    public string Duration { get; set; } = string.Empty;
    public List<Segment> Segments { get; set; } = new();
}

public class Segment
{
    public Departure Departure { get; set; } = new();
    public Arrival Arrival { get; set; } = new();
    public string CarrierCode { get; set; } = string.Empty;
    public string Number { get; set; } = string.Empty;
    public Aircraft Aircraft { get; set; } = new();
    public Operating? Operating { get; set; }
    public string Duration { get; set; } = string.Empty;
    public string Id { get; set; } = string.Empty;
    public int NumberOfStops { get; set; }
    public bool BlacklistedInEU { get; set; }
}

public class Departure
{
    public string IataCode { get; set; } = string.Empty;
    public string Terminal { get; set; } = string.Empty;
    public DateTime At { get; set; }
}

public class Arrival
{
    public string IataCode { get; set; } = string.Empty;
    public string Terminal { get; set; } = string.Empty;
    public DateTime At { get; set; }
}

public class Aircraft
{
    public string Code { get; set; } = string.Empty;
}

public class Operating
{
    public string CarrierCode { get; set; } = string.Empty;
}

public class Price
{
    public string Currency { get; set; } = string.Empty;
    public decimal Total { get; set; }
    public decimal Base { get; set; }
    public List<Fee> Fees { get; set; } = new();
    public decimal GrandTotal { get; set; }
}

public class Fee
{
    public decimal Amount { get; set; }
    public string Type { get; set; } = string.Empty;
}

public class PricingOptions
{
    public List<string> FareType { get; set; } = new();
    public bool IncludedCheckedBagsOnly { get; set; }
}

public class TravelerPricing
{
    public string TravelerId { get; set; } = string.Empty;
    public string FareOption { get; set; } = string.Empty;
    public string TravelerType { get; set; } = string.Empty;
    public Price Price { get; set; } = new();
    public List<FareDetailsBySegment> FareDetailsBySegment { get; set; } = new();
}

public class FareDetailsBySegment
{
    public string SegmentId { get; set; } = string.Empty;
    public string Cabin { get; set; } = string.Empty;
    public string FareBasis { get; set; } = string.Empty;
    public string Class { get; set; } = string.Empty;
    public IncludedCheckedBags? IncludedCheckedBags { get; set; }
}

public class IncludedCheckedBags
{
    public int? Weight { get; set; }
    public string? WeightUnit { get; set; }
    public int? Quantity { get; set; }
}

