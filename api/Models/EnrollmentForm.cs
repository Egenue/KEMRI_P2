using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace KemriApi.Models
{
    public class EnrollmentForm
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("screeningId")]
        public string ScreeningId { get; set; } = string.Empty;

        [BsonElement("healthFacility")]
        public string HealthFacility { get; set; } = string.Empty;

        [BsonElement("DoB")]
        public DateTime DoB { get; set; }

        [BsonElement("Age")]
        public AgeInfo Age { get; set; } = new();

        [BsonElement("maritalStatus")]
        public string MaritalStatus { get; set; } = string.Empty;

        [BsonElement("HusbandName")]
        public string? HusbandName { get; set; }

        [BsonElement("villageOfResidence")]
        public string VillageOfResidence { get; set; } = string.Empty;

        [BsonElement("educationLevel")]
        public string EducationLevel { get; set; } = string.Empty;

        [BsonElement("subjectOccupation")]
        public string SubjectOccupation { get; set; } = string.Empty;

        [BsonElement("otherOccupation")]
        public string? OtherOccupation { get; set; }

        [BsonElement("height")]
        public double Height { get; set; }

        [BsonElement("weight")]
        public double Weight { get; set; }

        [BsonElement("BMI")]
        public double BMI { get; set; }

        [BsonElement("vitalSigns")]
        public VitalSignsInfo VitalSigns { get; set; } = new();

        [BsonElement("submittedAt")]
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("estGestAge")]
        public double? EstGestAge { get; set; }

        [BsonElement("gaParameters")]
        public GaParametersInfo GaParameters { get; set; } = new();

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; }

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; }
    }

    public class AgeInfo
    {
        [BsonElement("months")]
        public int Months { get; set; }

        [BsonElement("years")]
        public int Years { get; set; }
    }

    public class VitalSignsInfo
    {
        [BsonElement("temperature")]
        public TemperatureInfo Temperature { get; set; } = new();

        [BsonElement("respiratoryRate")]
        public int RespiratoryRate { get; set; }

        [BsonElement("pulseRate")]
        public int PulseRate { get; set; }

        [BsonElement("bloodPressure")]
        public BloodPressureInfo BloodPressure { get; set; } = new();
    }

    public class TemperatureInfo
    {
        [BsonElement("value")]
        public double Value { get; set; }

        [BsonElement("location")]
        public string Location { get; set; } = string.Empty;
    }

    public class GaParametersInfo
    {
        [BsonElement("ultrasoundDate")]
        public DateTime? UltrasoundDate { get; set; }

        [BsonElement("usWeeks")]
        public int? UsWeeks { get; set; }

        [BsonElement("usDays")]
        public int? UsDays { get; set; }

        [BsonElement("lmpDate")]
        public DateTime? LmpDate { get; set; }

        [BsonElement("lmpCertainty")]
        public string? LmpCertainty { get; set; }

        [BsonElement("calculatedTrimester")]
        public string? CalculatedTrimester { get; set; }

        [BsonElement("finalPregnancyStartDate")]
        public DateTime? FinalPregnancyStartDate { get; set; }

        [BsonElement("gaAtEnrolmentDays")]
        public int? GaAtEnrolmentDays { get; set; }

        [BsonElement("edd")]
        public DateTime? Edd { get; set; }

        [BsonElement("source")]
        public string? Source { get; set; }

        [BsonElement("loc")]
        public string? Loc { get; set; }
    }
}
