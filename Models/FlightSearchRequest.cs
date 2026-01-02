namespace FlightSearchEngine.Models;

public class FlightSearchRequest
{
    public string OriginLocationCode { get; set; } = string.Empty;
    public string DestinationLocationCode { get; set; } = string.Empty;
    public DateTime DepartureDate { get; set; }
    public DateTime? ReturnDate { get; set; }
    public int Adults { get; set; } = 1;
    public int Children { get; set; } = 0;
    public int Infants { get; set; } = 0;
    public string TravelClass { get; set; } = "ECONOMY"; // ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
    public bool NonStop { get; set; } = false;
    public string CurrencyCode { get; set; } = "EUR";
    public int MaxResults { get; set; } = 50;
}

