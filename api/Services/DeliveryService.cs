using KemriApi.Data;
using KemriApi.Models;
using KemriApi.ViewModels;
using MongoDB.Driver;

namespace KemriApi.Services
{
    public interface IDeliveryService
    {
        Task<DeliveryForm?> CreateDeliveryAsync(DeliveryRequestModel request);
        Task<List<DeliveryForm>> GetAllDeliveriesAsync();
        Task<DeliveryForm?> GetDeliveryByScreeningIdAsync(string screeningId);
        Task<DeliveryForm?> UpdateDeliveryAsync(string screeningId, DeliveryRequestModel request);
        Task<bool> DeleteDeliveryAsync(string screeningId, string userInitials, string reason);
    }

    public class DeliveryService : IDeliveryService
    {
        private readonly MongoDbContext _context;
        private readonly IAuditService _auditService;

        public DeliveryService(MongoDbContext context, IAuditService auditService)
        {
            _context = context;
            _auditService = auditService;
        }

        public async Task<DeliveryForm?> CreateDeliveryAsync(DeliveryRequestModel request)
        {
            var exists = await GetDeliveryByScreeningIdAsync(request.DeliveryScreeningId);
            if (exists != null) return null;

            await _context.DeliveryForms.InsertOneAsync(request);
            await _auditService.LogAuditAsync("CREATE", "Delivery Form", request.DeliveryScreeningId, request.UserInitials ?? "SYSTEM", request.Reason ?? "Initial Entry", null, request);
            return request;
        }

        public async Task<List<DeliveryForm>> GetAllDeliveriesAsync()
        {
            return await _context.DeliveryForms.Find(_ => true).ToListAsync();
        }

        public async Task<DeliveryForm?> GetDeliveryByScreeningIdAsync(string screeningId)
        {
            return await _context.DeliveryForms.Find(f => f.DeliveryScreeningId == screeningId).FirstOrDefaultAsync();
        }

        public async Task<DeliveryForm?> UpdateDeliveryAsync(string screeningId, DeliveryRequestModel request)
        {
            var oldValue = await GetDeliveryByScreeningIdAsync(screeningId);
            if (oldValue == null) return null;

            request.Id = oldValue.Id;
            await _context.DeliveryForms.ReplaceOneAsync(f => f.DeliveryScreeningId == screeningId, request);
            await _auditService.LogAuditAsync("UPDATE", "Delivery Form", screeningId, request.UserInitials ?? "SYSTEM", request.Reason ?? "Data update", oldValue, request);
            return request;
        }

        public async Task<bool> DeleteDeliveryAsync(string screeningId, string userInitials, string reason)
        {
            var oldValue = await GetDeliveryByScreeningIdAsync(screeningId);
            if (oldValue == null) return false;

            var result = await _context.DeliveryForms.DeleteOneAsync(f => f.DeliveryScreeningId == screeningId);
            if (result.DeletedCount > 0)
            {
                await _auditService.LogAuditAsync("DELETE", "Delivery Form", screeningId, userInitials, reason, oldValue, null);
                return true;
            }
            return false;
        }
    }
}
