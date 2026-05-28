import mongoose from 'mongoose';

const screeningFormSchema = new mongoose.Schema({
    screeningId:{
        type: String,
        unique: true,
        required: true
    },
    interviewDate:{
        type: Date,
        required: true,
        default: Date.now
    },
    healthFacility:{
        type: String,
        enum: ['Bondo', 'Siaya', 'Kuoyo', 'Lumumba'],
        required: true
    },
    DoB:{
        type: Date,
        min: '1970-01-01',
        max: '2015-12-31',
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
    lastMenstrualPeriod:{
        date:{
            type: Date,
            default: Date.now
        },
        unknown:{
            type: Boolean,
            default: false
        }
    },
    fundalHeight:{
        type: Number,
        required: true
    },
    inclusionCriteria:{
        residentWithin15km:{
            type: String,
            enum: ['Yes', 'No'],
            required: true
        },
        pregnancyConfirmed:{
            type: String,
            enum: ['Yes', 'No'],
            required: true
        },
        gestationLessThan31Weeks:{
            type: String,
            enum: ['Yes', 'No'],
            required: true
        },
        consentsToHIVTesting:{
            type: String,
            enum: ['Yes', 'No'],
            required: true
        },
        willingToDeliverAtStudyHospital:{
            type: String,
            enum: ['Yes', 'No'],
            required: true
        }
    },
    exclusionCriteria:{
        multiplePregancy:{
            type: String,
            enum: ['Yes', 'No', "Don't Know"],
            required: true
        },
        fisturaRepairOrSpinalDeformity:{
            type: String,
            enum: ['Yes', 'No', "Don't Know"],
            required: true
        },
        unableToGiveInformedConsent:{
            type: String,
            enum: ['Yes', 'No'],
            required: true
        }
    },
    eligibility:{
        meetsAllCriteria:{
            type: String,
            enum: ['Yes', 'No'],
            required: true
        },
        consentedToParticipate:{
            type: String,
            enum: ['Yes', 'No'],
            required: function (){
                return this.eligibility && this.eligibility.meetsAllCriteria === "Yes"
            }
        },
        reasonForRefusal:{
            type: String,
            enum: ['Needs to consult', 'Other', null],
            default: null,
            required: function (){
                return this.eligibility && this.eligibility.consentedToParticipate === "No"
            }
        }
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    }
});

const screeningForm = mongoose.model('screeningForm', screeningFormSchema);

export default screeningForm;