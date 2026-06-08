using KemriApi.Data;
using KemriApi.Models;
using KemriApi.ViewModels;
using MongoDB.Driver;

namespace KemriApi.Services
{
    public interface IGestationAgeService
    {
        Task<GestationAge?> CreateGestAgeAsync(GestationAgeRequest request);
        Task<List<GestationAge>> GetAllGestAgesAsync();
        Task<GestationAge?> GetGestAgeByScreeningIdAsync(string screeningId);
        Task<GestationAge?> UpdateGestAgeAsync(string screeningId, GestationAgeRequest request);
        Task<bool> DeleteGestAgeAsync(string screeningId, string userInitials, string reason);
    }

    public class GestationAgeService : IGestationAgeService
    {
        private readonly MongoDbContext _context;
        private readonly IAuditService _auditService;

        public GestationAgeService(MongoDbContext context, IAuditService auditService)
        {
            _context = context;
            _auditService = auditService;
        }

        public async Task<GestationAge?> CreateGestAgeAsync(GestationAgeRequest request)
        {
            var exists = await GetGestAgeByScreeningIdAsync(request.screeningId);
            if (exists != null) return null;

            await _context.gestationAge.InsertOneAsync(request);
            await _auditService.LogAuditAsync("CREATE", "Gestation Age", request.screeningId, request.UserInitials ?? "SYSTEM", request.Reason ?? "Initial Entry", null, request);
            return request;
        }

        public async Task<List<GestationAge>> GetAllGestAgesAsync()
        {
            return await _context.gestationAge.Find(_ => true).ToListAsync();
        }

        public async Task<GestationAge?> GetGestAgeByScreeningIdAsync(string screeningId)
        {
            return await _context.gestationAge.Find(g => g.screeningId == screeningId).FirstOrDefaultAsync();
        }

        public async Task<GestationAge?> UpdateGestAgeAsync(string screeningId, GestationAgeRequest request)
        {
            var oldValue = await GetGestAgeByScreeningIdAsync(screeningId);
            if (oldValue == null) return null;

            request.Id = oldValue.Id;
            await _context.gestationAge.ReplaceOneAsync(g => g.screeningId == screeningId, request);
            await _auditService.LogAuditAsync("UPDATE", "Gestation Age", screeningId, request.UserInitials ?? "SYSTEM", request.Reason ?? "Data update", oldValue, request);
            return request;
        }

        public async Task<bool> DeleteGestAgeAsync(string screeningId, string userInitials, string reason)
        {
            var oldValue = await GetGestAgeByScreeningIdAsync(screeningId);
            if (oldValue == null) return false;

            var result = await _context.gestationAge.DeleteOneAsync(g => g.screeningId == screeningId);
            if (result.DeletedCount > 0)
            {
                await _auditService.LogAuditAsync("DELETE", "Gestation Age", screeningId, userInitials, reason, oldValue, null);
                return true;
            }
            return false;
        }
    }
}
