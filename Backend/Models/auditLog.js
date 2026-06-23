import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
    },
    module: {
        type: String,
        required: true,
    },
    recordId: {
        type: String,
        required: false,
    },
    userInitials: {
        type: String,
        required: true,
    },
    oldValue: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        default: null,
    },
    newValue: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        default: null,
    },
    reason: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
