import mongoose from 'mongoose';
export const deliveryForm = new mongoose.Schema({
    interviewDate:{
        type: Date,
        required: true,
        default: Date.now
    },
    physicalExam:{
        motherWeight:{
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
    },
    bodyMassIndex:{
        unknown:{
            type: Boolean,
            default: false
        },
        value:{
            type: Number,
            required: function(){
                return this.unknown === false;
            }
        }
    },
    motherAbnormality:{
        value:{
            type:String,
            enum:["Yes", "No"],
            required: true
        },
        specifics:{
            type: String,
            required: function(){
                return this.value === "Yes";
            }
        }
    },
    deliveryHistory:{
        deliveryDate:{
            type: Date,
            required: true,
            default: Date.now
        },
        deliveryTime:{
            type: String,
            required: true,
            match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
        },
        deliveryPlace:{
            choices:{
                type: String,
                enum:["Bondo", "Lumumba", "Siaya", "Home","Other Location", "Other hospital/clinic"]
            },
            otherLocation:{
                type: String,
                required: function(){
                    return this.choices === "Other Location"
                }
            },
            otherFacility:{
                type: String,
                required: function(){
                    return this.choices === "Other hospital/clinic"
                }
            }
        },
        deliveryPersonnel:{
            value:{
                type: String,
            enum:["Doctor", "Clinical Officer", "Nurse", "Midwife", "Traditional Birth Attendant",
                "Village Health Worker", "Other", "Don't know"]
            },
            other:{
                type: String,
                required: function(){
                    return this.value === "Other"
                }
            }
        },
        deliveryMode:{
            choices:{
                type: String,
                enum:["Spontaneous vaginal delivery (Normal", "Episiotomy",
                    "Vacuum", "Forceps", "C-section", "Other"]
            },
            otherMode:{
                type: String,
                required: function(){
                    return this.choices === "Other"
                }
            },
            csectionIndication:{
                type: String,
                required: function(){
                    return this.choices === "C-section"
                }
            }
        }

    }
});