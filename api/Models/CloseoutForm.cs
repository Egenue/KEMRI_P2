using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace KemriApi.Models
{
    public class CloseoutForm
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("sreeningId")]
        public string ScreeningId { get; set; } = string.Empty;

        [BsonElement("closeOutInterviewDate")]
        public DateTime CloseOutInterviewDate { get; set; } = DateTime.UtcNow;

        [BsonElement("dateOfTermination")]
        public DateTime DateOfTermination { get; set; } = DateTime.UtcNow;

        [BsonElement("participantStatus")]
        public ParticipantStatusInfo ParticipantStatus { get; set; } = new();

        [BsonElement("submittedBy")]
        public string? SubmittedBy { get; set; }

        [BsonElement("submittedAt")]
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    }

    public class ParticipantStatusInfo
    {
        [BsonElement("choicesStudy")]
        public string ChoicesStudy { get; set; } = string.Empty;

        [BsonElement("incompleteReason")]
        public IncompleteReasonInfo? IncompleteReason { get; set; }
    }

    public class IncompleteReasonInfo
    {
        [BsonElement("incompletionOptions")]
        public string? IncompletionOptions { get; set; }

        [BsonElement("adverseEvent")]
        public string? AdverseEvent { get; set; }

        [BsonElement("deathOption")]
        public DateTime? DeathOption { get; set; }

        [BsonElement("protocalDeviation")]
        public string? ProtocalDeviation { get; set; }

        [BsonElement("withdrawalReason")]
        public string? WithdrawalReason { get; set; }

        [BsonElement("otherReason")]
        public string? OtherReason { get; set; }
    }
}
