using KemriApi.Data;
using KemriApi.Models;
using KemriApi.ViewModels;
using MongoDB.Driver;
using BCrypt.Net;

namespace KemriApi.Services
{
    public interface ILoginService
    {
        Task<Login?> RegisterAsync(RegisterRequest request);
        Task<UserResponse?> LoginAsync(LoginRequest request);
        Task<List<Login>> GetAllLoginsAsync();
        Task<Login?> GetLoginByIdAsync(string id);
        Task<bool> DeleteLoginAsync(string id);
    }

    public class LoginService : ILoginService
    {
        private readonly MongoDbContext _context;

        public LoginService(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<Login?> RegisterAsync(RegisterRequest request)
        {
            var exists = await _context.Logins.Find(u => u.Email == request.Email || u.UserName == request.UserName).FirstOrDefaultAsync();
            if (exists != null) return null;

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);
            var newUser = new Login
            {
                FullName = request.FullName,
                Email = request.Email,
                UserName = request.UserName,
                Password = hashedPassword,
                UserRole = request.UserRole,
                DateCreated = DateTime.UtcNow
            };

            await _context.Logins.InsertOneAsync(newUser);
            return newUser;
        }

        public async Task<UserResponse?> LoginAsync(LoginRequest request)
        {
            Login? user = null;
            if (!string.IsNullOrEmpty(request.Email))
            {
                user = await _context.Logins.Find(u => u.Email == request.Email).FirstOrDefaultAsync();
            }
            else if (!string.IsNullOrEmpty(request.UserName))
            {
                user = await _context.Logins.Find(u => u.UserName == request.UserName).FirstOrDefaultAsync();
            }

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                return null;
            }

            user.DateLoggedIn = request.DateLoggedIn;
            await _context.Logins.ReplaceOneAsync(u => u.Id == user.Id, user);

            return new UserResponse
            {
                Email = user.Email,
                UserName = user.UserName,
                FullName = user.FullName,
                UserRole = user.UserRole,
                DateLoggedIn = user.DateLoggedIn
            };
        }

        public async Task<List<Login>> GetAllLoginsAsync()
        {
            return await _context.Logins.Find(_ => true).ToListAsync();
        }

        public async Task<Login?> GetLoginByIdAsync(string id)
        {
            return await _context.Logins.Find(u => u.Id == id).FirstOrDefaultAsync();
        }

        public async Task<bool> DeleteLoginAsync(string id)
        {
            var result = await _context.Logins.DeleteOneAsync(u => u.Id == id);
            return result.DeletedCount > 0;
        }
    }
}
