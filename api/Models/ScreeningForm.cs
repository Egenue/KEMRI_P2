using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace KemriApi.Models
{    public class ScreeningForm
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("UserInitials")]
        public string UserInitials { get; set; } = string.Empty;

        [BsonElement("screeningId")]
        public string ScreeningId { get; set; } = string.Empty;

        [BsonElement("interviewDate")]
        public DateTime InterviewDate { get; set; } = DateTime.UtcNow;

        [BsonElement("healthFacility")]
        public string HealthFacility { get; set; } = string.Empty;

        [BsonElement("DoB")]
        public DateTime DoB { get; set; }

        [BsonElement("Age")]
        public AgeInfo Age { get; set; } = new();

        [BsonElement("height")]
        public double Height { get; set; }

        [BsonElement("weight")]
        public double Weight { get; set; }

        [BsonElement("BMI")]
        public double BMI { get; set; }

        [BsonElement("vitalSigns")]
        public VitalSignsInfo VitalSigns { get; set; } = new();

        [BsonElement("lastMenstrualPeriod")]
        public LmpInfo LastMenstrualPeriod { get; set; } = new();

        [BsonElement("fundalHeight")]
        public double FundalHeight { get; set; }

        [BsonElement("inclusionCriteria")]
        public InclusionCriteriaInfo InclusionCriteria { get; set; } = new();

        [BsonElement("exclusionCriteria")]
        public ExclusionCriteriaInfo ExclusionCriteria { get; set; } = new();

        [BsonElement("eligibility")]
        public EligibilityInfo Eligibility { get; set; } = new();

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class LmpInfo
    {
        [BsonElement("date")]
        public DateTime Date { get; set; } = DateTime.UtcNow;

        [BsonElement("unknown")]
        public bool Unknown { get; set; }
    }

    public class InclusionCriteriaInfo
    {
        [BsonElement("residentWithin15km")]
        public string ResidentWithin15km { get; set; } = "No";

        [BsonElement("pregnancyConfirmed")]
        public string PregnancyConfirmed { get; set; } = "No";

        [BsonElement("gestationLessThan31Weeks")]
        public string GestationLessThan31Weeks { get; set; } = "No";

        [BsonElement("consentsToHIVTesting")]
        public string ConsentsToHIVTesting { get; set; } = "No";

        [BsonElement("willingToDeliverAtStudyHospital")]
        public string WillingToDeliverAtStudyHospital { get; set; } = "No";
    }

    public class ExclusionCriteriaInfo
    {
        [BsonElement("multiplePregancy")]
        public string MultiplePregancy { get; set; } = "No";

        [BsonElement("fisturaRepairOrSpinalDeformity")]
        public string FisturaRepairOrSpinalDeformity { get; set; } = "No";

        [BsonElement("unableToGiveInformedConsent")]
        public string UnableToGiveInformedConsent { get; set; } = "No";
    }

    public class EligibilityInfo
    {
        [BsonElement("meetsAllCriteria")]
        public string MeetsAllCriteria { get; set; } = "No";

        [BsonElement("consentedToParticipate")]
        public string ConsentedToParticipate { get; set; } = "No";

        [BsonElement("reasonForRefusal")]
        public string? ReasonForRefusal { get; set; }
    }
}
