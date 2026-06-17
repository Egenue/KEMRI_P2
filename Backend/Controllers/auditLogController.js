import AuditLog from "../Models/auditLog.js"

export const getAudit = async (req, res) => {
    try {
        const auditLogData = await AuditLog.find();
        return res.status(200).json({data: auditLogData});
    } catch (error) {
        return res.status(500).json({"message":"Error fetching audit logs"});
    }   
}