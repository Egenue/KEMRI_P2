using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace KemriApi.Models
{
    public class enrollmentForm
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("screeningId")]
        public string screeningId { get; set; } = string.Empty;

        [BsonElement("healthFacility")]
        public string healthFacility { get; set; } = string.Empty;

        [BsonElement("DoB")]
        public DateTime DoB { get; set; }

        [BsonElement("Age")]
        public AgeInfo Age { get; set; } = new();

        [BsonElement("maritalStatus")]
        public string maritalStatus { get; set; } = string.Empty;

        [BsonElement("HusbandName")]
        public string? HusbandName { get; set; }

        [BsonElement("villageOfResidence")]
        public string villageOfResidence { get; set; } = string.Empty;

        [BsonElement("educationLevel")]
        public string educationLevel { get; set; } = string.Empty;

        [BsonElement("subjectOccupation")]
        public string subjectOccupation { get; set; } = string.Empty;

        [BsonElement("otherOccupation")]
        public string? otherOccupation { get; set; }

        [BsonElement("height")]
        public double Height { get; set; }

        [BsonElement("weight")]
        public double Weight { get; set; }

        [BsonElement("BMI")]
        public double BMI { get; set; }

        [BsonElement("vitalSigns")]
        public VitalSignsInfo vitalSigns { get; set; } = new();

        [BsonElement("submittedAt")]
        public DateTime submittedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("estGestAge")]
        public double? EstGestAge { get; set; }

        [BsonElement("gaParameters")]
        public GaParametersInfo gaParameters { get; set; } = new();

        [BsonElement("createdAt")]
        public DateTime createdAt { get; set; }

        [BsonElement("updatedAt")]
        public DateTime updatedAt { get; set; }
    }

    public class AgeInfo
    {
        [BsonElement("months")]
        public int months { get; set; }

        [BsonElement("years")]
        public int years { get; set; }
    }

    public class VitalSignsInfo
    {
        [BsonElement("temperature")]
        public TemperatureInfo temperature { get; set; } = new();

        [BsonElement("respiratoryRate")]
        public int respiratoryRate { get; set; }

        [BsonElement("pulseRate")]
        public int pulseRate { get; set; }

        [BsonElement("bloodPressure")]
        public BloodPressureInfo bloodPressure { get; set; } = new();
    }

    public class TemperatureInfo
    {
        [BsonElement("value")]
        public double value { get; set; }

        [BsonElement("location")]
        public string location { get; set; } = string.Empty;
    }

    public class GaParametersInfo
    {
        [BsonElement("ultrasoundDate")]
        public DateTime? ultrasoundDate { get; set; }

        [BsonElement("usWeeks")]
        public int? usWeeks { get; set; }

        [BsonElement("usDays")]
        public int? usDays { get; set; }

        [BsonElement("lmpDate")]
        public DateTime? lmpDate { get; set; }

        [BsonElement("lmpCertainty")]
        public string? lmpCertainty { get; set; }

        [BsonElement("calculatedTrimester")]
        public string? calculatedTrimester { get; set; }

        [BsonElement("finalPregnancyStartDate")]
        public DateTime? finalPregnancyStartDate { get; set; }

        [BsonElement("gaAtEnrolmentDays")]
        public int? gaAtEnrolmentDays { get; set; }

        [BsonElement("edd")]
        public DateTime? edd { get; set; }

        [BsonElement("source")]
        public string? source { get; set; }

        [BsonElement("loc")]
        public string? loc { get; set; }
    }
}
