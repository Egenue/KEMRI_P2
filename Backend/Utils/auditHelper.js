import AuditLog from '../Models/auditLog.js';

const getAudit = async (req, res) => {
    try {
        const logs = await AuditLog.find().sort({ timestamp: -1 });
        res.status(200).json({ data: logs });
    } catch (error) {
        console.error('Failed to fetch audit logs:', error);
        res.status(500).json({ message: 'Failed to fetch audit logs', error: error.message });
    }
};

const logAudit = async ({ action, module, recordId, userInitials, oldValue, newValue, reason }) => {
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

export {getAudit, logAudit}