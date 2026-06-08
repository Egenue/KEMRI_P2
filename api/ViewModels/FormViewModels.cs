using KemriApi.Models;

namespace KemriApi.ViewModels
{
    public class EnrollmentRequest : enrollmentForm
    {
        public string? UserInitials { get; set; }
        public string? Reason { get; set; }
    }

    public class DeliveryRequestModel : deliveryForm
    {
        public string? UserInitials { get; set; }
        public string? Reason { get; set; }
    }
}
