import mongoose from 'mongoose';
const gestAge = new mongoose.Schema({
    screeningId:{
        type: String,
        required: true
    },
    lmp:{
        type: Date,
        required: true,
        default: null
    },
    ultrasoundDate:{
        usWeeks:{
            type: Date,
            required: true
        },
        usDays:{
            type: Date,
            required: true
        }
    },
    lmpCertainty:{
        type: Boolean,
        required: true
    },
    enrolmentDate:{
        type: Date,
        required:true
    }

});

const gestationAge = mongoose.model('gestationAge', gestAge);

export default gestationAge;