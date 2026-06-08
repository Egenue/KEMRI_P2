using KemriApi.Models;

namespace KemriApi.ViewModels
{
    public class ScreeningRequest : ScreeningForm
    {
        public new string? UserInitials { get; set; }
        public string? Reason { get; set; }
    }
}
