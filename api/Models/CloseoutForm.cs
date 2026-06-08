using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace KemriApi.Models
{
    public class closeoutForm
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("sreeningId")]
        public string screeningId { get; set; } = string.Empty;

        [BsonElement("closeOutInterviewDate")]
        public DateTime closeOutInterviewDate { get; set; } = DateTime.UtcNow;

        [BsonElement("dateOfTermination")]
        public DateTime dateOfTermination { get; set; } = DateTime.UtcNow;

        [BsonElement("participantStatus")]
        public ParticipantStatusInfo participantStatus { get; set; } = new();

        [BsonElement("submittedBy")]
        public string? submittedBy { get; set; }

        [BsonElement("submittedAt")]
        public DateTime submittedAt { get; set; } = DateTime.UtcNow;
    }

    public class ParticipantStatusInfo
    {
        [BsonElement("choicesStudy")]
        public string choicesStudy { get; set; } = string.Empty;

        [BsonElement("incompleteReason")]
        public IncompleteReasonInfo? incompleteReason { get; set; }
    }

    public class IncompleteReasonInfo
    {
        [BsonElement("incompletionOptions")]
        public string? incompletionOptions { get; set; }

        [BsonElement("adverseEvent")]
        public string? adverseEvent { get; set; }

        [BsonElement("deathOption")]
        public DateTime? deathOption { get; set; }

        [BsonElement("protocalDeviation")]
        public string? protocalDeviation { get; set; }

        [BsonElement("withdrawalReason")]
        public string? withdrawalReason { get; set; }

        [BsonElement("otherReason")]
        public string? otherReason { get; set; }
    }
}
