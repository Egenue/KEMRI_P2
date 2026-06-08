using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace KemriApi.Models
{
    public class DeliveryForm
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("interviewDate")]
        public DateTime InterviewDate { get; set; } = DateTime.UtcNow;

        [BsonElement("deliveryScreeningId")]
        public string DeliveryScreeningId { get; set; } = string.Empty;

        [BsonElement("physicalExam")]
        public DeliveryPhysicalExamInfo PhysicalExam { get; set; } = new();

        [BsonElement("bodyMassIndex")]
        public BmiInfo BodyMassIndex { get; set; } = new();

        [BsonElement("motherAbnormality")]
        public MotherAbnormalityInfo MotherAbnormality { get; set; } = new();

        [BsonElement("deliveryHistory")]
        public DeliveryHistoryInfo DeliveryHistory { get; set; } = new();

        [BsonElement("closeOut")]
        public DeliveryCloseOutInfo? CloseOut { get; set; }
    }

    public class DeliveryPhysicalExamInfo
    {
        [BsonElement("motherWeight")]
        public double MotherWeight { get; set; }

        [BsonElement("vitalSigns")]
        public DeliveryVitalSignsInfo VitalSigns { get; set; } = new();
    }

    public class DeliveryVitalSignsInfo
    {
        [BsonElement("temperature")]
        public TemperatureInfo Temperature { get; set; } = new();

        [BsonElement("respiratoryRate")]
        public int RespiratoryRate { get; set; }

        [BsonElement("pulseRate")]
        public int PulseRate { get; set; }

        [BsonElement("bloodPressure")]
        public BloodPressureInfo BloodPressure { get; set; } = new();

        [BsonElement("oxygenSaturation")]
        public OxygenSaturationInfo OxygenSaturation { get; set; } = new();
    }

    public class OxygenSaturationInfo
    {
        [BsonElement("oxygenValue")]
        public double OxygenValue { get; set; }

        [BsonElement("oxygenOptions")]
        public string OxygenOptions { get; set; } = string.Empty;
    }

    public class BmiInfo
    {
        [BsonElement("value")]
        public double? Value { get; set; }

        [BsonElement("unknown")]
        public bool Unknown { get; set; }
    }

    public class MotherAbnormalityInfo
    {
        [BsonElement("motherAbnomValue")]
        public string MotherAbnomValue { get; set; } = string.Empty;

        [BsonElement("specifics")]
        public string? Specifics { get; set; }
    }

    public class DeliveryHistoryInfo
    {
        [BsonElement("deliveryDate")]
        public DateTime DeliveryDate { get; set; } = DateTime.UtcNow;

        [BsonElement("deliveryTime")]
        public string DeliveryTime { get; set; } = string.Empty;

        [BsonElement("deliveryPlace")]
        public DeliveryPlaceInfo DeliveryPlace { get; set; } = new();

        [BsonElement("deliveryPersonnel")]
        public DeliveryPersonnelInfo DeliveryPersonnel { get; set; } = new();

        [BsonElement("deliveryMode")]
        public DeliveryModeInfo DeliveryMode { get; set; } = new();
    }

    public class DeliveryPlaceInfo
    {
        [BsonElement("deliveryChoices")]
        public string? DeliveryChoices { get; set; }

        [BsonElement("otherLocation")]
        public string? OtherLocation { get; set; }

        [BsonElement("otherFacility")]
        public string? OtherFacility { get; set; }
    }

    public class DeliveryPersonnelInfo
    {
        [BsonElement("deliveryPersValue")]
        public string? DeliveryPersValue { get; set; }

        [BsonElement("otherPersonnel")]
        public string? OtherPersonnel { get; set; }
    }

    public class DeliveryModeInfo
    {
        [BsonElement("choices")]
        public string? Choices { get; set; }

        [BsonElement("otherMode")]
        public string? OtherMode { get; set; }

        [BsonElement("csectionIndication")]
        public CSectionIndicationInfo? CSectionIndication { get; set; }
    }

    public class CSectionIndicationInfo
    {
        [BsonElement("csectOptions")]
        public string? CSectOptions { get; set; }

        [BsonElement("otherOption")]
        public string? OtherOption { get; set; }
    }

    public class DeliveryCloseOutInfo
    {
        [BsonElement("closeOutInterviewDate")]
        public DateTime? CloseOutInterviewDate { get; set; }

        [BsonElement("sreeningId")]
        public string? ScreeningId { get; set; }

        [BsonElement("dateOfTermination")]
        public DateTime? DateOfTermination { get; set; }

        [BsonElement("participantStatus")]
        public ParticipantStatusInfo? ParticipantStatus { get; set; }
    }
}
