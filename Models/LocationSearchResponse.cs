namespace FlightSearchEngine.Models;

public class LocationSearchResponse
{
    public List<Location> Data { get; set; } = new();
    public Meta Meta { get; set; } = new();
}

public class Location
{
    public string Type { get; set; } = string.Empty;
    public string SubType { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string DetailedName { get; set; } = string.Empty;
    public string Id { get; set; } = string.Empty;
    public string IataCode { get; set; } = string.Empty;
    public Address Address { get; set; } = new();
    public GeoCode GeoCode { get; set; } = new();
}

public class Address
{
    public string CityName { get; set; } = string.Empty;
    public string CityCode { get; set; } = string.Empty;
    public string CountryName { get; set; } = string.Empty;
    public string CountryCode { get; set; } = string.Empty;
    public string RegionCode { get; set; } = string.Empty;
}

public class GeoCode
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}

