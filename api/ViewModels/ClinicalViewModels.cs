using KemriApi.Models;

namespace KemriApi.ViewModels
{
    public class AncVisitRequest : AncVisit
    {
        public string? UserInitials { get; set; }
        public string? Reason { get; set; }
    }

    public class GestationAgeRequest : GestationAge
    {
        public string? UserInitials { get; set; }
        public string? Reason { get; set; }
    }
}
