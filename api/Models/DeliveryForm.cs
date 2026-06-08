using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace KemriApi.Models
{
    public class deliveryForm
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("interviewDate")]
        public DateTime interviewDate { get; set; } = DateTime.UtcNow;

        [BsonElement("deliveryScreeningId")]
        public string deliveryScreeningId { get; set; } = string.Empty;

        [BsonElement("physicalExam")]
        public DeliveryPhysicalExamInfo physicalExam { get; set; } = new();

        [BsonElement("bodyMassIndex")]
        public BmiInfo bodyMassIndex { get; set; } = new();

        [BsonElement("motherAbnormality")]
        public MotherAbnormalityInfo motherAbnormality { get; set; } = new();

        [BsonElement("deliveryHistory")]
        public DeliveryHistoryInfo deliveryHistory { get; set; } = new();

        [BsonElement("closeOut")]
        public DeliveryCloseOutInfo? closeOut { get; set; }
    }

    public class DeliveryPhysicalExamInfo
    {
        [BsonElement("motherWeight")]
        public double motherWeight { get; set; }

        [BsonElement("vitalSigns")]
        public DeliveryVitalSignsInfo vitalSigns { get; set; } = new();
    }

    public class DeliveryVitalSignsInfo
    {
        [BsonElement("temperature")]
        public TemperatureInfo temperature { get; set; } = new();

        [BsonElement("respiratoryRate")]
        public int respiratoryRate { get; set; }

        [BsonElement("pulseRate")]
        public int pulseRate { get; set; }

        [BsonElement("bloodPressure")]
        public BloodPressureInfo bloodPressure { get; set; } = new();

        [BsonElement("oxygenSaturation")]
        public OxygenSaturationInfo oxygenSaturation { get; set; } = new();
    }

    public class OxygenSaturationInfo
    {
        [BsonElement("oxygenValue")]
        public double oxygenValue { get; set; }

        [BsonElement("oxygenOptions")]
        public string oxygenOptions { get; set; } = string.Empty;
    }

    public class BmiInfo
    {
        [BsonElement("value")]
        public double? value { get; set; }

        [BsonElement("unknown")]
        public bool unknown { get; set; }
    }

    public class MotherAbnormalityInfo
    {
        [BsonElement("motherAbnomValue")]
        public string motherAbnomValue { get; set; } = string.Empty;

        [BsonElement("specifics")]
        public string? specifics { get; set; }
    }

    public class DeliveryHistoryInfo
    {
        [BsonElement("deliveryDate")]
        public DateTime deliveryDate { get; set; } = DateTime.UtcNow;

        [BsonElement("deliveryTime")]
        public string deliveryTime { get; set; } = string.Empty;

        [BsonElement("deliveryPlace")]
        public DeliveryPlaceInfo deliveryPlace { get; set; } = new();

        [BsonElement("deliveryPersonnel")]
        public DeliveryPersonnelInfo deliveryPersonnel { get; set; } = new();

        [BsonElement("deliveryMode")]
        public DeliveryModeInfo deliveryMode { get; set; } = new();
    }

    public class DeliveryPlaceInfo
    {
        [BsonElement("deliveryChoices")]
        public string? deliveryChoices { get; set; }

        [BsonElement("otherLocation")]
        public string? otherLocation { get; set; }

        [BsonElement("otherFacility")]
        public string? otherFacility { get; set; }
    }

    public class DeliveryPersonnelInfo
    {
        [BsonElement("deliveryPersValue")]
        public string? deliveryPersValue { get; set; }

        [BsonElement("otherPersonnel")]
        public string? otherPersonnel { get; set; }
    }

    public class DeliveryModeInfo
    {
        [BsonElement("choices")]
        public string? choices { get; set; }

        [BsonElement("otherMode")]
        public string? OtherMode { get; set; }

        [BsonElement("csectionIndication")]
        public CSectionIndicationInfo? csectionIndication { get; set; }
    }

    public class CSectionIndicationInfo
    {
        [BsonElement("csectOptions")]
        public string? csectOptions { get; set; }

        [BsonElement("otherOption")]
        public string? otherOption { get; set; }
    }

    public class DeliveryCloseOutInfo
    {
        [BsonElement("closeOutInterviewDate")]
        public DateTime? closeOutInterviewDate { get; set; }

        [BsonElement("sreeningId")]
        public string? sreeningId { get; set; }

        [BsonElement("dateOfTermination")]
        public DateTime? dateOfTermination { get; set; }

        [BsonElement("participantStatus")]
        public ParticipantStatusInfo? participantStatus { get; set; }
    }
}
