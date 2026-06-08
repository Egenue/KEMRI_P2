using KemriApi.Data;
using KemriApi.Models;
using KemriApi.ViewModels;
using MongoDB.Driver;

namespace KemriApi.Services
{
    public interface IAncVisitService
    {
        Task<AncVisit?> CreateAncVisitAsync(AncVisitRequest request);
        Task<List<AncVisit>> GetAllAncVisitsAsync();
        Task<AncVisit?> GetAncVisitByNumberAsync(string visitNumber);
        Task<bool> DeleteAncVisitAsync(string visitNumber, string userInitials, string reason);
    }

    public class AncVisitService : IAncVisitService
    {
        private readonly MongoDbContext _context;
        private readonly IAuditService _auditService;

        public AncVisitService(MongoDbContext context, IAuditService auditService)
        {
            _context = context;
            _auditService = auditService;
        }

        public async Task<AncVisit?> CreateAncVisitAsync(AncVisitRequest request)
        {
            await _context.AncVisits.InsertOneAsync(request);
            await _auditService.LogAuditAsync("CREATE", "ANC Visit", request.VisitNumber, request.UserInitials ?? "SYSTEM", request.Reason ?? "Initial Entry", null, request);
            return request;
        }

        public async Task<List<AncVisit>> GetAllAncVisitsAsync()
        {
            return await _context.AncVisits.Find(_ => true).ToListAsync();
        }

        public async Task<AncVisit?> GetAncVisitByNumberAsync(string visitNumber)
        {
            return await _context.AncVisits.Find(v => v.VisitNumber == visitNumber).FirstOrDefaultAsync();
        }

        public async Task<bool> DeleteAncVisitAsync(string visitNumber, string userInitials, string reason)
        {
            var oldValue = await GetAncVisitByNumberAsync(visitNumber);
            if (oldValue == null) return false;

            var result = await _context.AncVisits.DeleteOneAsync(v => v.VisitNumber == visitNumber);
            if (result.DeletedCount > 0)
            {
                await _auditService.LogAuditAsync("DELETE", "ANC Visit", visitNumber, userInitials, reason, oldValue, null);
                return true;
            }
            return false;
        }
    }
}
