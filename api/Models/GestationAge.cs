using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace KemriApi.Models
{
    public class gestationAge
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("screeningId")]
        public string screeningId { get; set; } = string.Empty;

        [BsonElement("lmp")]
        public DateTime? lmp { get; set; }

        [BsonElement("ultrasoundDate")]
        public UltrasoundDateInfo ultrasoundDate { get; set; } = new();

        [BsonElement("lmpCertainty")]
        public string lmpCertainty { get; set; } = string.Empty;

        [BsonElement("enrolmentDate")]
        public DateTime enrolmentDate { get; set; }

        [BsonElement("estDueDate")]
        public DateTime estDueDate { get; set; }

        [BsonElement("currentGestAge")]
        public CurrentGestAgeInfo currentGestAge { get; set; } = new();
    }

    public class UltrasoundDateInfo
    {
        [BsonElement("usWeeks")]
        public int usWeeks { get; set; }

        [BsonElement("usDays")]
        public int usDays { get; set; }
    }

    public class CurrentGestAgeInfo
    {
        [BsonElement("gestweeks")]
        public int gestweeks { get; set; }

        [BsonElement("gestdays")]
        public int gestdays { get; set; }
    }
}
