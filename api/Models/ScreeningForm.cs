using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace KemriApi.Models
{    public class screeningForm
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("userInitials")]
        public string userInitials { get; set; } = string.Empty;

        [BsonElement("screeningId")]
        public string screeningId { get; set; } = string.Empty;

        [BsonElement("interviewDate")]
        public DateTime interviewDate { get; set; } = DateTime.UtcNow;

        [BsonElement("healthFacility")]
        public string healthFacility { get; set; } = string.Empty;

        [BsonElement("DoB")]
        public DateTime DoB { get; set; }

        [BsonElement("Age")]
        public AgeInfo Age { get; set; } = new();

        [BsonElement("height")]
        public double height { get; set; }

        [BsonElement("weight")]
        public double weight { get; set; }

        [BsonElement("BMI")]
        public double BMI { get; set; }

        [BsonElement("vitalSigns")]
        public VitalSignsInfo vitalSigns { get; set; } = new();

        [BsonElement("lastMenstrualPeriod")]
        public LmpInfo lastMenstrualPeriod { get; set; } = new();

        [BsonElement("fundalHeight")]
        public double fundalHeight { get; set; }

        [BsonElement("inclusionCriteria")]
        public InclusionCriteriaInfo inclusionCriteria { get; set; } = new();

        [BsonElement("exclusionCriteria")]
        public ExclusionCriteriaInfo exclusionCriteria { get; set; } = new();

        [BsonElement("eligibility")]
        public EligibilityInfo eligibility { get; set; } = new();

        [BsonElement("createdAt")]
        public DateTime createdAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime updatedAt { get; set; } = DateTime.UtcNow;
    }

    public class LmpInfo
    {
        [BsonElement("date")]
        public DateTime date { get; set; } = DateTime.UtcNow;

        [BsonElement("unknown")]
        public bool unknown { get; set; }
    }

    public class InclusionCriteriaInfo
    {
        [BsonElement("residentWithin15km")]
        public string residentWithin15km { get; set; } = "No";

        [BsonElement("pregnancyConfirmed")]
        public string pregnancyConfirmed { get; set; } = "No";

        [BsonElement("gestationLessThan31Weeks")]
        public string gestationLessThan31Weeks { get; set; } = "No";

        [BsonElement("consentsToHIVTesting")]
        public string consentsToHIVTesting { get; set; } = "No";

        [BsonElement("willingToDeliverAtStudyHospital")]
        public string willingToDeliverAtStudyHospital { get; set; } = "No";
    }

    public class ExclusionCriteriaInfo
    {
        [BsonElement("multiplePregancy")]
        public string multiplePregancy { get; set; } = "No";

        [BsonElement("fisturaRepairOrSpinalDeformity")]
        public string fisturaRepairOrSpinalDeformity { get; set; } = "No";

        [BsonElement("unableToGiveInformedConsent")]
        public string unableToGiveInformedConsent { get; set; } = "No";
    }

    public class EligibilityInfo
    {
        [BsonElement("meetsAllCriteria")]
        public string meetsAllCriteria { get; set; } = "No";

        [BsonElement("consentedToParticipate")]
        public string consentedToParticipate { get; set; } = "No";

        [BsonElement("reasonForRefusal")]
        public string? reasonForRefusal { get; set; }
    }
}
