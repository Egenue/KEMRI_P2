import mongoose from 'mongoose';

const ancVisitSchema = new mongoose.Schema({
    visitNumber:{
        type:String,
        required: true
    },
    visitDate:{
        type: Date,
        required: true,
        default: Date.now
    },
    gestationAge:{
        gestWeeks:{
            type: Number,
            required: true
        },
        gestDays:{
            type: Number,
            required: true
        }
    },
    weightKilos:{
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
    fundalHeight:{
        type: Number,
        required: true
    },
    muac:{
        type: Number,
        required: true
    },
    complaints:{
        type: String,
        requrd: true,
        default: 'None'
    },
    medicationGiven:{
        type: String,
        required: true,
        default: 'None'
    },
    nextAppointment:{
        type: Date,
        required:true
    }
});

const ancVisit = mongoose.model('ancVisit', ancVisitSchema);
export default ancVisit;