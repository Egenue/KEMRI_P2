using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace KemriApi.Models
{
    public class Login
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("email")]
        public string Email { get; set; } = string.Empty;

        [BsonElement("userName")]
        public string UserName { get; set; } = string.Empty;

        [BsonElement("fullName")]
        public string FullName { get; set; } = string.Empty;

        [BsonElement("userRole")]
        public string UserRole { get; set; } = string.Empty; // 'Data Manager', 'Field Technician', 'Admin'

        [BsonElement("password")]
        public string Password { get; set; } = string.Empty;

        [BsonElement("dateLoggedIn")]
        public DateTime DateLoggedIn { get; set; } = DateTime.UtcNow;

        [BsonElement("dateCreated")]
        public DateTime? DateCreated { get; set; }
    }
}
