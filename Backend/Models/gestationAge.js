import mongoose from 'mongoose';
const gestAge = new mongoose.Schema({
    screeningId:{
        type: String,
        required: true
    },
    lmp:{
        type: Date,
        required: false,
        default: null
    },
    ultrasoundDate:{
        usWeeks:{
            type: Number,
            required: true
        },
        usDays:{
            type: Number,
            required: true
        }
    },
    lmpCertainty:{
        type: String,
        required: true
    },
    enrolmentDate:{
        type: Date,
        required:true
    }

});

const gestationAge = mongoose.model('gestationAge', gestAge);

export default gestationAge;