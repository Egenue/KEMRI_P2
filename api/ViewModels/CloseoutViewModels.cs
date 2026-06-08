using KemriApi.Models;

namespace KemriApi.ViewModels
{
    public class CloseoutRequest : CloseoutForm
    {
        public string? UserInitials { get; set; }
        public string? Reason { get; set; }
    }
}
