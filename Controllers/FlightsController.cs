using Microsoft.AspNetCore.Mvc;
using FlightSearchEngine.Models;
using FlightSearchEngine.Services;

namespace FlightSearchEngine.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FlightsController : ControllerBase
{
    private readonly IFlightService _flightService;
    private readonly ILogger<FlightsController> _logger;

    public FlightsController(IFlightService flightService, ILogger<FlightsController> logger)
    {
        _flightService = flightService;
        _logger = logger;
    }

    [HttpPost("search")]
    public async Task<ActionResult<FlightSearchResponse>> SearchFlights([FromBody] FlightSearchRequest request)
    {
        try
        {
            _logger.LogInformation("Searching flights from {Origin} to {Destination}", 
                request.OriginLocationCode, request.DestinationLocationCode);

            var result = await _flightService.SearchFlightsAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching flights");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPost("search-with-filters")]
    public async Task<ActionResult<FlightSearchResponse>> SearchFlightsWithFilters(
        [FromBody] FlightSearchWithFiltersRequest request)
    {
        try
        {
            _logger.LogInformation("Searching flights with filters from {Origin} to {Destination}", 
                request.SearchRequest.OriginLocationCode, request.SearchRequest.DestinationLocationCode);

            var result = await _flightService.SearchFlightsAsync(request.SearchRequest);

            // Apply filters
            if (request.FilterOptions != null)
            {
                result.Data = _flightService.FilterFlights(result.Data, request.FilterOptions);
            }

            // Apply sorting
            if (!string.IsNullOrEmpty(request.SortBy))
            {
                result.Data = _flightService.SortFlights(result.Data, request.SortBy);
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching flights with filters");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpGet("locations")]
    public async Task<ActionResult<LocationSearchResponse>> SearchLocations([FromQuery] string keyword)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(keyword) || keyword.Length < 2)
            {
                return BadRequest(new { error = "Keyword must be at least 2 characters long" });
            }

            _logger.LogInformation("Searching locations for keyword: {Keyword}", keyword);

            var result = await _flightService.SearchLocationsAsync(keyword);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching locations");
            return StatusCode(500, new { error = ex.Message });
        }
    }
}

public class FlightSearchWithFiltersRequest
{
    public FlightSearchRequest SearchRequest { get; set; } = new();
    public FlightFilterOptions? FilterOptions { get; set; }
    public string? SortBy { get; set; }
}

