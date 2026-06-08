using KemriApi.Models;

namespace KemriApi.ViewModels
{
    public class AncVisitRequest : ancVisit
    {
        public string? UserInitials { get; set; }
        public string? Reason { get; set; }
    }

    public class GestationAgeRequest : gestationAge
    {
        public string? UserInitials { get; set; }
        public string? Reason { get; set; }
    }
}
