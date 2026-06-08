using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace KemriApi.Models
{
    public class ancVisit
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("visitNumber")]
        public string visitNumber { get; set; } = string.Empty;

        [BsonElement("visitDate")]
        public DateTime visitDate { get; set; } = DateTime.UtcNow;

        [BsonElement("gestationAge")]
        public GestationAgeInfo gestationAge { get; set; } = new();

        [BsonElement("weightKilos")]
        public double weightKilos { get; set; }

        [BsonElement("bloodPressure")]
        public BloodPressureInfo bloodPressure { get; set; } = new();

        [BsonElement("fundalHeight")]
        public double fundalHeight { get; set; }

        [BsonElement("muac")]
        public double muac { get; set; }

        [BsonElement("complaints")]
        public string complaints { get; set; } = "None";

        [BsonElement("medicationGiven")]
        public string medicationGiven { get; set; } = "None";

        [BsonElement("nextAppointment")]
        public DateTime nextAppointment { get; set; }
    }

    public class GestationAgeInfo
    {
        [BsonElement("gestWeeks")]
        public int gestWeeks { get; set; }

        [BsonElement("gestDays")]
        public int gestDays { get; set; }
    }

    public class BloodPressureInfo
    {
        [BsonElement("systolic")]
        public int systolic { get; set; }

        [BsonElement("diastolic")]
        public int diastolic { get; set; }
    }
}
