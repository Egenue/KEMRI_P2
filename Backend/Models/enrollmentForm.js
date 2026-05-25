import mongoose from 'mongoose';
const enrollmentFormSchema = new mongoose.Schema({
    screeningId:{
        type: String,
        unique: true,
        required: true
    },
    healthFacility:{
        type: String,
        enum: ['Bondo', 'Siaya', 'Kuoyo', 'Lumumba'],
        required: true
    },
    DoB:{
        type: Date,
        min: '1972-01-01',
        max: '2006-01-01',
        required: true
    },
    Age:{
        months:{
            type: Number,
            required: true
        },
        years:{
            type: Number,
            required: true
        }
    },
    maritalStatus:{
        type: String,
        enum: ['Married', 'Single', 'Divorced', 'Widowed'],
        required: true
    },
    HusbandName:{
        type: String,
        required: function() {
            return this.maritalStatus === 'Married';
        }
    },
    villageOfResidence:{
        type: String,
        required: true
    },
    educationLevel:{
        type: String,
        enum:["Never Attended School", "Primary", "Secondary", "University/Collage"],
        required: true
    },
    subjectOccupation: {
        type: String,
        enum:["Farmer", "Business woman", "Fisherman/Fish monger",
            "Home maker","Salaried worker","Other"],
        required: true
    },
    otherOccupation:{
        type: String,
        required: function() {
            return this.subjectOccupation === 'Other';
        }
    },
    height:{
        type: Number,
        required: true
    },
    weight:{
        type: Number,
        required: true
    },
    vitalSigns:{
        temperature:{
            value:{
                type: Number,
                required: true
            },
            location:{
                type: String,
                enum: ['Axillary', 'Oral', 'Tympanic'],
                required: true
            }
        },
        respiratoryRate:{
            type: Number,
            required: true
        },
        pulseRate:{
            type: Number,
            required: true
        },
        bloodPressure:{
            systolic:{
                type: Number,
                required: true
            },
            diastolic:{
                type: Number,
                required: true
            }
        }
    },
    estGestAge:{
        type: Number,
        required: true
    },
    gaParameters: {
        ultrasoundDate: { type: Date, required: false },
        usWeeks: { type: Number, required: false },
        usDays: { type: Number, required: false },
        lmpDate: { type: Date, required: false },
        lmpCertainty: { type: String, enum: ['certain', 'uncertain', ''], required: false },
        calculatedTrimester: { type: String, required: false },
        finalPregnancyStartDate: { type: Date, required: false },
        gaAtEnrolmentDays: { type: Number, required: false },
        edd: { type: Date, required: false },
        source: { type: String, required: false },
        loc: { type: String, required: false }
    }
});

const EnrollmentForm = mongoose.model('EnrollmentForm', enrollmentFormSchema);

export default EnrollmentForm;