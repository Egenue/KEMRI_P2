using KemriApi.Data;
using KemriApi.Models;

namespace KemriApi.Services
{
    public interface IAuditService
    {
        Task LogAuditAsync(string action, string module, string recordId, string userInitials, string reason, object? oldValue = null, object? newValue = null);
    }

    public class AuditService : IAuditService
    {
        private readonly MongoDbContext _context;

        public AuditService(MongoDbContext context)
        {
            _context = context;
        }

        public async Task LogAuditAsync(string action, string module, string recordId, string userInitials, string reason, object? oldValue = null, object? newValue = null)
        {
            var log = new AuditLog
            {
                Action = action,
                Module = module,
                RecordId = recordId,
                UserInitials = userInitials,
                OldValue = oldValue,
                NewValue = newValue,
                Reason = reason,
                Timestamp = DateTime.UtcNow
            };

            await _context.AuditLogs.InsertOneAsync(log);
        }
    }
}
