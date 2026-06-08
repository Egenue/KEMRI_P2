using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace KemriApi.Models
{
    public class GestationAge
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("screeningId")]
        public string ScreeningId { get; set; } = string.Empty;

        [BsonElement("lmp")]
        public DateTime? Lmp { get; set; }

        [BsonElement("ultrasoundDate")]
        public UltrasoundDateInfo UltrasoundDate { get; set; } = new();

        [BsonElement("lmpCertainty")]
        public string LmpCertainty { get; set; } = string.Empty;

        [BsonElement("enrolmentDate")]
        public DateTime EnrolmentDate { get; set; }

        [BsonElement("estDueDate")]
        public DateTime EstDueDate { get; set; }

        [BsonElement("currentGestAge")]
        public CurrentGestAgeInfo CurrentGestAge { get; set; } = new();
    }

    public class UltrasoundDateInfo
    {
        [BsonElement("usWeeks")]
        public int UsWeeks { get; set; }

        [BsonElement("usDays")]
        public int UsDays { get; set; }
    }

    public class CurrentGestAgeInfo
    {
        [BsonElement("gestweeks")]
        public int GestWeeks { get; set; }

        [BsonElement("gestdays")]
        public int GestDays { get; set; }
    }
}
