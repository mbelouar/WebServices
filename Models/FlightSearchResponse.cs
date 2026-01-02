namespace FlightSearchEngine.Models;

public class FlightSearchResponse
{
    public List<FlightOffer> Data { get; set; } = new();
    public Dictionary<string, string> Dictionaries { get; set; } = new();
    public Meta Meta { get; set; } = new();
}

public class Meta
{
    public int Count { get; set; }
    public Links? Links { get; set; }
}

public class Links
{
    public string? Self { get; set; }
}

