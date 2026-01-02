namespace FlightSearchEngine.Models;

public class AmadeusAuthResponse
{
    public string Type { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Application_name { get; set; } = string.Empty;
    public string Client_id { get; set; } = string.Empty;
    public string Token_type { get; set; } = string.Empty;
    public string Access_token { get; set; } = string.Empty;
    public int Expires_in { get; set; }
    public string State { get; set; } = string.Empty;
    public string Scope { get; set; } = string.Empty;
}

