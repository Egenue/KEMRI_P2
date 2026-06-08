namespace KemriApi.ViewModels
{
    public class LoginRequest
    {
        public string? Email { get; set; }
        public string? UserName { get; set; }
        public string Password { get; set; } = string.Empty;
        public DateTime DateLoggedIn { get; set; } = DateTime.UtcNow;
    }

    public class RegisterRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string UserRole { get; set; } = string.Empty;
    }

    public class UserResponse
    {
        public string Email { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string UserRole { get; set; } = string.Empty;
        public DateTime DateLoggedIn { get; set; }
    }
}
