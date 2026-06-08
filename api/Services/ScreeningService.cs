using KemriApi.Data;
using KemriApi.Models;
using KemriApi.ViewModels;
using MongoDB.Driver;

namespace KemriApi.Services
{
    public interface IScreeningService
    {
        Task<ScreeningForm?> CreateScreeningAsync(ScreeningRequest request);
        Task<List<ScreeningForm>> GetAllScreeningsAsync();
        Task<ScreeningForm?> GetScreeningByIdAsync(string screeningId);
        Task<ScreeningForm?> UpdateScreeningAsync(string screeningId, ScreeningRequest request);
        Task<bool> DeleteScreeningAsync(string screeningId, string userInitials, string reason);
    }

    public class ScreeningService : IScreeningService
    {
        private readonly MongoDbContext _context;
        private readonly IAuditService _auditService;

        public ScreeningService(MongoDbContext context, IAuditService auditService)
        {
            _context = context;
            _auditService = auditService;
        }

        public async Task<ScreeningForm?> CreateScreeningAsync(ScreeningRequest request)
        {
            var exists = await _context.ScreeningForms.Find(f => f.ScreeningId == request.ScreeningId).FirstOrDefaultAsync();
            if (exists != null) return null;

            await _context.ScreeningForms.InsertOneAsync(request);

            await _auditService.LogAuditAsync("CREATE", "Screening Form", request.ScreeningId, request.UserInitials ?? "SYSTEM", request.Reason ?? "Initial Entry", null, request);

            return request;
        }

        public async Task<List<ScreeningForm>> GetAllScreeningsAsync()
        {
            return await _context.ScreeningForms.Find(_ => true).ToListAsync();
        }

        public async Task<ScreeningForm?> GetScreeningByIdAsync(string screeningId)
        {
            return await _context.ScreeningForms.Find(f => f.ScreeningId == screeningId).FirstOrDefaultAsync();
        }

        public async Task<ScreeningForm?> UpdateScreeningAsync(string screeningId, ScreeningRequest request)
        {
            var oldValue = await GetScreeningByIdAsync(screeningId);
            if (oldValue == null) return null;

            request.Id = oldValue.Id; // Keep the same MongoDB Id
            request.UpdatedAt = DateTime.UtcNow;

            await _context.ScreeningForms.ReplaceOneAsync(f => f.ScreeningId == screeningId, request);

            await _auditService.LogAuditAsync("UPDATE", "Screening Form", screeningId, request.UserInitials ?? "SYSTEM", request.Reason ?? "Data update", oldValue, request);

            return request;
        }

        public async Task<bool> DeleteScreeningAsync(string screeningId, string userInitials, string reason)
        {
            var oldValue = await GetScreeningByIdAsync(screeningId);
            if (oldValue == null) return false;

            var result = await _context.ScreeningForms.DeleteOneAsync(f => f.ScreeningId == screeningId);
            if (result.DeletedCount > 0)
            {
                await _auditService.LogAuditAsync("DELETE", "Screening Form", screeningId, userInitials, reason, oldValue, null);

                // Cascade delete
                await _context.EnrollmentForms.DeleteManyAsync(f => f.ScreeningId == screeningId);
                await _context.DeliveryForms.DeleteManyAsync(f => f.DeliveryScreeningId == screeningId);
                await _context.CloseoutForms.DeleteManyAsync(f => f.ScreeningId == screeningId);
                await _context.GestationAges.DeleteManyAsync(f => f.ScreeningId == screeningId);

                return true;
            }
            return false;
        }
    }
}
