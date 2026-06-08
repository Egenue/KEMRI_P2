using KemriApi.Models;

namespace KemriApi.ViewModels
{
    public class EnrollmentRequest : EnrollmentForm
    {
        public string? UserInitials { get; set; }
        public string? Reason { get; set; }
    }

    public class DeliveryRequestModel : DeliveryForm
    {
        public string? UserInitials { get; set; }
        public string? Reason { get; set; }
    }
}
