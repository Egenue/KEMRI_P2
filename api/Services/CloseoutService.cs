using KemriApi.Data;
using KemriApi.Models;
using KemriApi.ViewModels;
using MongoDB.Driver;

namespace KemriApi.Services
{
    public interface ICloseoutService
    {
        Task<CloseoutForm?> CreateCloseoutAsync(CloseoutRequest request);
        Task<List<CloseoutForm>> GetAllCloseoutsAsync();
        Task<CloseoutForm?> GetCloseoutByScreeningIdAsync(string screeningId);
        Task<CloseoutForm?> UpdateCloseoutAsync(string screeningId, CloseoutRequest request);
        Task<bool> DeleteCloseoutAsync(string screeningId, string userInitials, string reason);
    }

    public class CloseoutService : ICloseoutService
    {
        private readonly MongoDbContext _context;
        private readonly IAuditService _auditService;

        public CloseoutService(MongoDbContext context, IAuditService auditService)
        {
            _context = context;
            _auditService = auditService;
        }

        public async Task<CloseoutForm?> CreateCloseoutAsync(CloseoutRequest request)
        {
            var exists = await GetCloseoutByScreeningIdAsync(request.ScreeningId);
            if (exists != null) return null;

            await _context.closeoutForm.InsertOneAsync(request);
            await _auditService.LogAuditAsync("CREATE", "Closeout Form", request.ScreeningId, request.UserInitials ?? "SYSTEM", request.Reason ?? "Initial Entry", null, request);
            return request;
        }

        public async Task<List<CloseoutForm>> GetAllCloseoutsAsync()
        {
            return await _context.closeoutForm.Find(_ => true).ToListAsync();
        }

        public async Task<CloseoutForm?> GetCloseoutByScreeningIdAsync(string screeningId)
        {
            return await _context.closeoutForm.Find(f => f.ScreeningId == screeningId).FirstOrDefaultAsync();
        }

        public async Task<CloseoutForm?> UpdateCloseoutAsync(string screeningId, CloseoutRequest request)
        {
            var oldValue = await GetCloseoutByScreeningIdAsync(screeningId);
            if (oldValue == null) return null;

            request.Id = oldValue.Id;
            await _context.closeoutForm.ReplaceOneAsync(f => f.ScreeningId == screeningId, request);
            await _auditService.LogAuditAsync("UPDATE", "Closeout Form", screeningId, request.UserInitials ?? "SYSTEM", request.Reason ?? "Data update", oldValue, request);
            return request;
        }

        public async Task<bool> DeleteCloseoutAsync(string screeningId, string userInitials, string reason)
        {
            var oldValue = await GetCloseoutByScreeningIdAsync(screeningId);
            if (oldValue == null) return false;

            var result = await _context.closeoutForm.DeleteOneAsync(f => f.ScreeningId == screeningId);
            if (result.DeletedCount > 0)
            {
                await _auditService.LogAuditAsync("DELETE", "Closeout Form", screeningId, userInitials, reason, oldValue, null);
                return true;
            }
            return false;
        }
    }
}
