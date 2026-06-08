using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace KemriApi.Models
{
    public class AncVisit
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("visitNumber")]
        public string VisitNumber { get; set; } = string.Empty;

        [BsonElement("visitDate")]
        public DateTime VisitDate { get; set; } = DateTime.UtcNow;

        [BsonElement("gestationAge")]
        public GestationAgeInfo GestationAge { get; set; } = new();

        [BsonElement("weightKilos")]
        public double WeightKilos { get; set; }

        [BsonElement("bloodPressure")]
        public BloodPressureInfo BloodPressure { get; set; } = new();

        [BsonElement("fundalHeight")]
        public double FundalHeight { get; set; }

        [BsonElement("muac")]
        public double Muac { get; set; }

        [BsonElement("complaints")]
        public string Complaints { get; set; } = "None";

        [BsonElement("medicationGiven")]
        public string MedicationGiven { get; set; } = "None";

        [BsonElement("nextAppointment")]
        public DateTime NextAppointment { get; set; }
    }

    public class GestationAgeInfo
    {
        [BsonElement("gestWeeks")]
        public int GestWeeks { get; set; }

        [BsonElement("gestDays")]
        public int GestDays { get; set; }
    }

    public class BloodPressureInfo
    {
        [BsonElement("systolic")]
        public int Systolic { get; set; }

        [BsonElement("diastolic")]
        public int Diastolic { get; set; }
    }
}
