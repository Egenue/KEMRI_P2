import AuditLog from '../Models/auditLog.js';

export const logAudit = async ({ action, module, recordId, userInitials, oldValue, newValue, reason }) => {
    try {
        const log = new AuditLog({
            action,
            module,
            recordId,
            userInitials,
            oldValue,
            newValue,
            reason: reason || 'Not specified'
        });
        await log.save();
    } catch (error) {
        console.error('Failed to save audit log:', error);
    }
};
