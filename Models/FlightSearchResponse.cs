using Newtonsoft.Json;

namespace FlightSearchEngine.Models;

public class FlightSearchResponse
{
    public List<FlightOffer> Data { get; set; } = new();
    
    [JsonProperty("dictionaries")]
    public Dictionary<string, object>? Dictionaries { get; set; }
    
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

