import mongoose from 'mongoose';
const deliveryForm = new mongoose.Schema(
    {
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
                options:{
                    type: String,enum:[
                        "Prolonged labour", "Fetal distress", "Meconium-stained amniotic fluid", "Antepartum hemorrhage",
                        "Pre-eclempic toxemia", "cephalopelvic disproportion", "Malpresentation", "Elective C-section",
                        "Pregnancy-induced hypertension", "Other", "Don't know"
                    ],
                    required: function(){
                        return this.choices === "C-section"
                    }
                },
                otherOption:{
                    type: String,
                    required: function (){
                        return this.options === "Other"
                    }
                }
            }
        }
    },
    closeOut:{
        interviewDate:{
            type: Date,
            required: true,
            default: Date.now
        },
        sreeningId:{
            type: String,
            required: true
        },
        dateOfTermination:{
            type: Date,
            required: true,
            default: Date.now
        },
        participantStatus:{
            choicesStudy:{
                type: String,
                enum:["Completed study visits", "Participation terminated prior to completion of study visits",
                "Screen failure before enrollment"]
            },
            incompleteReason:{
                incompletionOptions:{
                    type: String,
                    enum:["Death", "Lost to follow-up","Physician decision", "Protocol deviation", "Screen failure",
                    "Study terminated by sponsor", "Withrawal by participant", "Other"]
                },
                deathOption:{
                    type: Date,
                    required: function (){
                        return this.incompletionOptions === "Death"
                    }
                },
                protocalDeviation:{
                    type: String,
                    required: function (){
                        return this.incompletionOptions === "Protocol deviation"
                    }
                },
                withdrawalReason:{
                    type: String,
                    required: function (){
                        return this.incompleteReason === "Withdrawal by participant"
                    }
                },
                otherReason:{
                    type: String,
                    required: function (){
                        return this.incompleteReason === "Other"
                    }
                }
            }
        }
    }
});

export default deliveryForm ;