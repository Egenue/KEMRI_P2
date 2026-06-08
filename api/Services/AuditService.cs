using KemriApi.Data;
using KemriApi.Models;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Text.Json;

namespace KemriApi.Services
{
    public interface IAuditService
    {
        Task LogAuditAsync(string action, string module, string recordId, string userInitials, string reason, object? oldValue = null, object? newValue = null);
    }

    public class AuditService : IAuditService
    {
        private readonly MongoDbContext _context;

        // 1. Move the collection property here (Class level scope)
        private IMongoCollection<AuditLog> _auditCollection => _context.AuditLog;

        public AuditService(MongoDbContext context)
        {
            _context = context;
        }

        public async Task LogAuditAsync(string action, string module, string recordId, string userInitials, string reason, object? oldValue = null, object? newValue = null)
        {
            BsonValue bsonOld = BsonNull.Value;
            BsonValue bsonNew = BsonNull.Value;

            // Convert old values safely through isolated JSON intermediary text
            if (oldValue != null)
            {
                var oldJson = JsonSerializer.Serialize(oldValue);
                bsonOld = BsonDocument.Parse(oldJson);
            }

            // Convert new values safely through isolated JSON intermediary text
            if (newValue != null)
            {
                var newJson = JsonSerializer.Serialize(newValue);
                bsonNew = BsonDocument.Parse(newJson);
            }

            var auditEntry = new AuditLog
            {
                Action = action,
                Module = module,
                RecordId = recordId,
                UserInitials = userInitials,
                Reason = reason,
                OldValue = bsonOld, 
                NewValue = bsonNew, 
                Timestamp = DateTime.UtcNow
            };

            await _auditCollection.InsertOneAsync(auditEntry);
        }
    }
}