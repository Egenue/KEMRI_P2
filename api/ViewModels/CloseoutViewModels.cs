using KemriApi.Models;

namespace KemriApi.ViewModels
{
    public class CloseoutRequest : closeoutForm
    {
        public string? UserInitials { get; set; }
        public string? Reason { get; set; }
    }
}
