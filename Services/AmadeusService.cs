using FlightSearchEngine.Models;
using Newtonsoft.Json;
using System.Text;

namespace FlightSearchEngine.Services;

public class AmadeusService : IAmadeusService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private string? _accessToken;
    private DateTime _tokenExpiration;

    public AmadeusService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _httpClient.BaseAddress = new Uri(_configuration["AmadeusApi:BaseUrl"] ?? "https://test.api.amadeus.com");
    }

    public async Task<string> GetAccessTokenAsync()
    {
        if (!string.IsNullOrEmpty(_accessToken) && DateTime.UtcNow < _tokenExpiration)
        {
            return _accessToken;
        }

        var clientId = _configuration["AmadeusApi:ClientId"];
        var clientSecret = _configuration["AmadeusApi:ClientSecret"];

        var content = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("grant_type", "client_credentials"),
            new KeyValuePair<string, string>("client_id", clientId ?? ""),
            new KeyValuePair<string, string>("client_secret", clientSecret ?? "")
        });

        var response = await _httpClient.PostAsync("/v1/security/oauth2/token", content);
        response.EnsureSuccessStatusCode();

        var responseContent = await response.Content.ReadAsStringAsync();
        var authResponse = JsonConvert.DeserializeObject<AmadeusAuthResponse>(responseContent);

        if (authResponse != null)
        {
            _accessToken = authResponse.Access_token;
            _tokenExpiration = DateTime.UtcNow.AddSeconds(authResponse.Expires_in - 60);
            return _accessToken;
        }

        throw new Exception("Failed to obtain access token");
    }

    public async Task<FlightSearchResponse> SearchFlightsAsync(FlightSearchRequest request)
    {
        var token = await GetAccessTokenAsync();
        _httpClient.DefaultRequestHeaders.Authorization = 
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

        var queryParams = new List<string>
        {
            $"originLocationCode={request.OriginLocationCode}",
            $"destinationLocationCode={request.DestinationLocationCode}",
            $"departureDate={request.DepartureDate:yyyy-MM-dd}",
            $"adults={request.Adults}",
            $"travelClass={request.TravelClass}",
            $"currencyCode={request.CurrencyCode}",
            $"max={request.MaxResults}"
        };

        if (request.ReturnDate.HasValue)
        {
            queryParams.Add($"returnDate={request.ReturnDate.Value:yyyy-MM-dd}");
        }

        if (request.Children > 0)
        {
            queryParams.Add($"children={request.Children}");
        }

        if (request.Infants > 0)
        {
            queryParams.Add($"infants={request.Infants}");
        }

        if (request.NonStop)
        {
            queryParams.Add("nonStop=true");
        }

        var queryString = string.Join("&", queryParams);
        var response = await _httpClient.GetAsync($"/v2/shopping/flight-offers?{queryString}");
        
        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new Exception($"Amadeus API error: {response.StatusCode} - {errorContent}");
        }

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonConvert.DeserializeObject<FlightSearchResponse>(content);
        
        return result ?? new FlightSearchResponse();
    }

    public async Task<LocationSearchResponse> SearchLocationsAsync(string keyword)
    {
        var token = await GetAccessTokenAsync();
        _httpClient.DefaultRequestHeaders.Authorization = 
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

        var response = await _httpClient.GetAsync(
            $"/v1/reference-data/locations?subType=CITY,AIRPORT&keyword={Uri.EscapeDataString(keyword)}&page[limit]=10");
        
        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new Exception($"Amadeus API error: {response.StatusCode} - {errorContent}");
        }

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonConvert.DeserializeObject<LocationSearchResponse>(content);
        
        return result ?? new LocationSearchResponse();
    }
}

