import AuditLog from '../Models/auditLog.js';

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

const getAudit = async (req, res) => {
    try {
        const auditLogData = await AuditLog.find();
        if (auditLogData == null) {
            return res.status(204).json({message:"No audit logs found"});
        }else{
            return res.status(200).json({data: auditLogData});
        }
    } catch (error) {
        
    }   
}

export {getAudit, logAudit}