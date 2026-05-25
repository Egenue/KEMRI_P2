import mongoose from 'mongoose';

const closeoutFormSchema = new mongoose.Schema({
    sreeningId: {
        type: String,
        unique: true,
        required: true
    },
    closeOutInterviewDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateOfTermination: {
        type: Date,
        required: true,
        default: Date.now
    },
    participantStatus: {
        choicesStudy: {
            type: String,
            enum: ["Completed study visits", "Participation terminated prior to completion of study visits", "Screen failure before enrollment"],
            required: true
        },
        incompleteReason: {
            incompletionOptions: {
                type: String,
                enum: ["Adverse event", "Death", "Lost to follow-up", "Physician decision", "Protocol deviation", "Screen failure", "Study terminated by sponsor", "Withrawal by participant", "Other"],
                required: false
            },
            adverseEvent: { type: String, required: false },
            deathOption: { type: Date, required: false },
            protocalDeviation: { type: String, required: false },
            withdrawalReason: { type: String, required: false },
            otherReason: { type: String, required: false },
        }
    },
    submittedBy: { type: String, required: false },
    submittedAt: { type: Date, default: Date.now }
});

const closeoutForm = mongoose.model('closeoutForm', closeoutFormSchema);

export default closeoutForm;
