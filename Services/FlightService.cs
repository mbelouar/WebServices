using FlightSearchEngine.Models;

namespace FlightSearchEngine.Services;

public class FlightService : IFlightService
{
    private readonly IAmadeusService _amadeusService;

    public FlightService(IAmadeusService amadeusService)
    {
        _amadeusService = amadeusService;
    }

    public async Task<FlightSearchResponse> SearchFlightsAsync(FlightSearchRequest request)
    {
        return await _amadeusService.SearchFlightsAsync(request);
    }

    public async Task<LocationSearchResponse> SearchLocationsAsync(string keyword)
    {
        return await _amadeusService.SearchLocationsAsync(keyword);
    }

    public List<FlightOffer> SortFlights(List<FlightOffer> flights, string sortBy)
    {
        return sortBy.ToLower() switch
        {
            "price_asc" => flights.OrderBy(f => f.Price.Total).ToList(),
            "price_desc" => flights.OrderByDescending(f => f.Price.Total).ToList(),
            "duration_asc" => flights.OrderBy(f => GetTotalDuration(f)).ToList(),
            "duration_desc" => flights.OrderByDescending(f => GetTotalDuration(f)).ToList(),
            "departure_asc" => flights.OrderBy(f => f.Itineraries.FirstOrDefault()?.Segments.FirstOrDefault()?.Departure.At).ToList(),
            "departure_desc" => flights.OrderByDescending(f => f.Itineraries.FirstOrDefault()?.Segments.FirstOrDefault()?.Departure.At).ToList(),
            _ => flights
        };
    }

    public List<FlightOffer> FilterFlights(List<FlightOffer> flights, FlightFilterOptions filterOptions)
    {
        var filteredFlights = flights.AsEnumerable();

        if (filterOptions.DirectFlightsOnly == true)
        {
            filteredFlights = filteredFlights.Where(f => 
                f.Itineraries.All(i => i.Segments.Count == 1));
        }

        if (filterOptions.MinDepartureTime.HasValue || filterOptions.MaxDepartureTime.HasValue)
        {
            filteredFlights = filteredFlights.Where(f =>
            {
                var departureTime = f.Itineraries.FirstOrDefault()?.Segments.FirstOrDefault()?.Departure.At.TimeOfDay;
                if (departureTime == null) return false;

                if (filterOptions.MinDepartureTime.HasValue && departureTime < filterOptions.MinDepartureTime.Value)
                    return false;
                if (filterOptions.MaxDepartureTime.HasValue && departureTime > filterOptions.MaxDepartureTime.Value)
                    return false;

                return true;
            });
        }

        if (filterOptions.MinArrivalTime.HasValue || filterOptions.MaxArrivalTime.HasValue)
        {
            filteredFlights = filteredFlights.Where(f =>
            {
                var arrivalTime = f.Itineraries.FirstOrDefault()?.Segments.LastOrDefault()?.Arrival.At.TimeOfDay;
                if (arrivalTime == null) return false;

                if (filterOptions.MinArrivalTime.HasValue && arrivalTime < filterOptions.MinArrivalTime.Value)
                    return false;
                if (filterOptions.MaxArrivalTime.HasValue && arrivalTime > filterOptions.MaxArrivalTime.Value)
                    return false;

                return true;
            });
        }

        if (filterOptions.MaxPrice.HasValue)
        {
            filteredFlights = filteredFlights.Where(f => f.Price.Total <= filterOptions.MaxPrice.Value);
        }

        if (filterOptions.Airlines != null && filterOptions.Airlines.Any())
        {
            filteredFlights = filteredFlights.Where(f =>
                f.Itineraries.Any(i => i.Segments.Any(s => filterOptions.Airlines.Contains(s.CarrierCode))));
        }

        return filteredFlights.ToList();
    }

    private TimeSpan GetTotalDuration(FlightOffer flight)
    {
        var totalMinutes = 0;
        foreach (var itinerary in flight.Itineraries)
        {
            if (System.Text.RegularExpressions.Regex.IsMatch(itinerary.Duration, @"PT(\d+H)?(\d+M)?"))
            {
                var match = System.Text.RegularExpressions.Regex.Match(itinerary.Duration, @"PT(?:(\d+)H)?(?:(\d+)M)?");
                var hours = match.Groups[1].Success ? int.Parse(match.Groups[1].Value) : 0;
                var minutes = match.Groups[2].Success ? int.Parse(match.Groups[2].Value) : 0;
                totalMinutes += hours * 60 + minutes;
            }
        }
        return TimeSpan.FromMinutes(totalMinutes);
    }
}

