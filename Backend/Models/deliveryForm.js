import mongoose from 'mongoose';
const deliveryFormSchema = new mongoose.Schema(
    {
    interviewDate:{
        type: Date,
        required: true,
        default: Date.now
    },
    deliveryScreeningId:{
        type: String,
        unique: true,
        required: true
    },
    physicalExam:{
        motherWeight:{
            type: Number,
            required: true
        },
        vitalSigns:{
            temperature:{
                tempValue:{
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
            },
            oxygenSaturation:{
                oxygenValue:{
                    type: Number,
                    required: true
                },
                oxygenOptions:{
                    type: String,
                    enum:['On room air', 'With supplemental oxygen'],
                    required: true
                }
            }
        },
    },
    bodyMassIndex:{
        value:{
            type: Number,
            required: true,
            default: null
        },
        unknown:{
            type: Boolean,
            required: function(){
                return this.value === null
            }
        },
    },
    motherAbnormality:{
        motherAbnomValue:{
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
            deliveryChoices:{
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
            deliveryPersValue:{
                type: String,
                enum:["Doctor", "Clinical Officer", "Nurse", "Midwife", "Traditional Birth Attendant",
                "Village Health Worker", "Other", "Don't know"]
            },
            otherPersonnel:{
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
                csectOptions:{
                    type: String,
                    enum:[
                        "Prolonged labour",  "Fetal distress", "Meconium-stained amniotic fluid", "Antepartum hemorrhage",
                        "Pre-eclempic toxemia", "cephalopelvic disproportion", "Malpresentation", "Elective C-section",
                        "Pregnancy-induced hypertension", "Other", "Don't know"
                    ],
                    required: function(){
                        return this.choices === "C-section"
                    },
                },
                otherOption:{
                    type: String,
                    required: function (){
                        return this.csectOptions === "Other"
                    }
                }
            }
        }
    },
    closeOut:{
        closeOutInterviewDate:{
            type: Date,
            required: true,
            default: Date.now
        },
        sreeningId:{
            type: String,
            unique: true,
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
                    enum:["Adverse event","Death", "Lost to follow-up","Physician decision", "Protocol deviation", "Screen failure",
                    "Study terminated by sponsor", "Withrawal by participant", "Other"]
                },
                adverseEvent:{
                    type: String,
                    required: function(){
                        return this.incompletionOptions === "Adverse event"
                    }
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

const deliveryForm = mongoose.model('deliveryForm', deliveryFormSchema);

export default deliveryForm ;