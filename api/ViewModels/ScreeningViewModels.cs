using KemriApi.Models;

namespace KemriApi.ViewModels
{
    public class ScreeningRequest : screeningForm
    {
        public new string? userInitials { get; set; }
        public string? reason { get; set; }
    }
}
