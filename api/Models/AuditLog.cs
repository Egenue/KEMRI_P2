using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace KemriApi.Models
{
    public class AuditLog
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("action")]
        public string Action { get; set; } = string.Empty;

        [BsonElement("module")]
        public string Module { get; set; } = string.Empty;

        [BsonElement("recordId")]
        public string RecordId { get; set; } = string.Empty;

        [BsonElement("userInitials")]
        public string UserInitials { get; set; } = string.Empty;

        [BsonElement("oldValue")]
        public object? OldValue { get; set; }

        [BsonElement("newValue")]
        public object? NewValue { get; set; }

        [BsonElement("reason")]
        public string Reason { get; set; } = string.Empty;

        [BsonElement("timestamp")]
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
