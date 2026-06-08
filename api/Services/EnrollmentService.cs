using KemriApi.Data;
using KemriApi.Models;
using KemriApi.ViewModels;
using MongoDB.Driver;

namespace KemriApi.Services
{
    public interface IEnrollmentService
    {
        Task<EnrollmentForm?> CreateEnrollmentAsync(EnrollmentRequest request);
        Task<List<EnrollmentForm>> GetAllEnrollmentsAsync();
        Task<EnrollmentForm?> GetEnrollmentByScreeningIdAsync(string screeningId);
        Task<EnrollmentForm?> UpdateEnrollmentAsync(string screeningId, EnrollmentRequest request);
        Task<bool> DeleteEnrollmentAsync(string screeningId, string userInitials, string reason);
    }

    public class EnrollmentService : IEnrollmentService
    {
        private readonly MongoDbContext _context;
        private readonly IAuditService _auditService;

        public EnrollmentService(MongoDbContext context, IAuditService auditService)
        {
            _context = context;
            _auditService = auditService;
        }

        public async Task<EnrollmentForm?> CreateEnrollmentAsync(EnrollmentRequest request)
        {
            var exists = await GetEnrollmentByScreeningIdAsync(request.ScreeningId);
            if (exists != null) return null;

            // Validate parent screening exists
            var parent = await _context.ScreeningForms.Find(f => f.ScreeningId == request.ScreeningId).FirstOrDefaultAsync();
            if (parent == null) return null;

            await _context.EnrollmentForms.InsertOneAsync(request);
            await _auditService.LogAuditAsync("CREATE", "Enrollment Form", request.ScreeningId, request.UserInitials ?? "SYSTEM", request.Reason ?? "Initial Entry", null, request);
            return request;
        }

        public async Task<List<EnrollmentForm>> GetAllEnrollmentsAsync()
        {
            return await _context.EnrollmentForms.Find(_ => true).ToListAsync();
        }

        public async Task<EnrollmentForm?> GetEnrollmentByScreeningIdAsync(string screeningId)
        {
            return await _context.EnrollmentForms.Find(f => f.ScreeningId == screeningId).FirstOrDefaultAsync();
        }

        public async Task<EnrollmentForm?> UpdateEnrollmentAsync(string screeningId, EnrollmentRequest request)
        {
            var oldValue = await GetEnrollmentByScreeningIdAsync(screeningId);
            if (oldValue == null) return null;

            request.Id = oldValue.Id;
            await _context.EnrollmentForms.ReplaceOneAsync(f => f.ScreeningId == screeningId, request);
            await _auditService.LogAuditAsync("UPDATE", "Enrollment Form", screeningId, request.UserInitials ?? "SYSTEM", request.Reason ?? "Data update", oldValue, request);
            return request;
        }

        public async Task<bool> DeleteEnrollmentAsync(string screeningId, string userInitials, string reason)
        {
            var oldValue = await GetEnrollmentByScreeningIdAsync(screeningId);
            if (oldValue == null) return false;

            var result = await _context.EnrollmentForms.DeleteOneAsync(f => f.ScreeningId == screeningId);
            if (result.DeletedCount > 0)
            {
                await _auditService.LogAuditAsync("DELETE", "Enrollment Form", screeningId, userInitials, reason, oldValue, null);
                return true;
            }
            return false;
        }
    }
}
