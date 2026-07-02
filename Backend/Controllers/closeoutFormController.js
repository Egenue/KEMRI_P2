import closeoutForm from '../Models/closeoutForm.js';
import deliveryForm from '../Models/deliveryForm.js';
import EnrollmentForm from '../Models/enrollmentForm.js';
import screeningForm from '../Models/screeningForm.js';
import gestationAge from '../Models/gestationAge.js';
import ancVisit from '../Models/ancVisit.js';
import { logAudit } from '../Utils/auditHelper.js';

const createCloseoutForm = async (req, res) => {
    try {
        let data = req.body;
        if (req.body.record) {
            data = { ...req.body.record, userInitials: req.body.userInitials, reason: req.body.reason };
        }
        const {
            sreeningId,
            userInitials,
            closeOutInterviewDate,
            dateOfTermination,
            participantStatus = {},
            submittedBy,
            submittedAt,
            reason
        } = data;

        const {choicesStudy, incompleteReason = {} } = participantStatus;
        const {
            incompletionOptions,
            adverseEvent,
            deathOption,
            protocalDeviation,
            withdrawalReason,
            otherReason
        } = incompleteReason;
        
        if (!sreeningId || !closeOutInterviewDate || !dateOfTermination || !participantStatus) {
            return res.status(400).json({ "message": "Please fill in all required fields" });
        }

        const exists = await closeoutForm.findOne({ sreeningId: sreeningId });
        if (exists) {
            return res.status(409).json({ "message": "Closeout record already exists for this Screening ID" });
        } else {
            const newCloseoutForm = new closeoutForm({
                sreeningId,
                closeOutInterviewDate,
                dateOfTermination,
                participantStatus,
                submittedBy
            });
            await newCloseoutForm.save();
            await logAudit({
                action: 'CREATE',
                module: 'Closeout Form',
                recordId: sreeningId,
                userInitials: userInitials || 'SYSTEM',
                oldValue: null,
                newValue: newCloseoutForm,
                reason: reason || 'Initial Entry'
            });

            await Promise.all([
                deliveryForm.deleteMany({ deliveryScreeningId: sreeningId }),
                EnrollmentForm.deleteMany({ screeningId: sreeningId }),
                screeningForm.deleteMany({ screeningId: sreeningId }),
                gestationAge.deleteMany({ screeningId: sreeningId }),
                ancVisit.deleteMany({ screeningId: sreeningId }),
            ]);

            return res.status(200).json({ "message": "Closeout data saved successfully", data: newCloseoutForm });
        }
    } catch (error) {
        return res.status(500).json({ "message": "Error, could not create closeout form", error: error.message });
    }
}

const getAllCloseoutForms = async (req, res) => {
    try {
        const closeoutData = await closeoutForm.find({});
        return res.status(200).json(closeoutData);
    } catch (error) {
        return res.status(500).json({ "message": "Failed operation", error: error.message });
    }
}

const getOneCloseoutForm = async (req, res) => {
    try {
        const { id } = req.params;
        const closeoutDataDoc = await closeoutForm.findOne({ sreeningId: id });
        if (!closeoutDataDoc) {
            return res.status(404).json({ "message": "Closeout form not found" });
        } else {
            return res.status(200).json(closeoutDataDoc);
        }
    } catch (error) {
        return res.status(500).json({ message: "Error, could not get closeout form", error: error.message });
    }
}

const updateCloseoutForm = async (req, res) => {
    try {
        let newClose = req.body;
        if (req.body.record) {
            newClose = { ...req.body.record, userInitials: req.body.userInitials, reason: req.body.reason };
        }
        const { userInitials, reason } = newClose;
        const oldValue = await closeoutForm.findOne({ sreeningId: newClose.sreeningId });
        const updatedData = await closeoutForm.findOneAndUpdate(
            { sreeningId: newClose.sreeningId },
            newClose,
            { new: true, runValidators: true }
        );

        if (!updatedData) {
            return res.status(404).json({ "message": "Closeout form not found" });
        } else {
            await logAudit({
                action: 'UPDATE',
                module: 'Closeout Form',
                recordId: newClose.sreeningId,
                userInitials: userInitials || 'SYSTEM',
                oldValue,
                newValue: updatedData,
                reason: reason || 'Data update'
            });
            return res.status(200).json({ "message": "Updated successfully", data: updatedData });
        }
    } catch (error) {
        return res.status(500).json({ "message": "Error updating closeout form", error: error.message });
    }
}

const deleteCloseoutForm = async (req, res) => {
    try {
        const sreeningId = req.params.id || req.params.sreeningId;
        const { userInitials, reason } = req.body;
        const oldValue = await closeoutForm.findOne({ sreeningId });
        const deleted = await closeoutForm.findOneAndDelete({ sreeningId });
        if (!deleted) {
            return res.status(404).json({ "message": "Closeout form not found" });
        } else {
            await logAudit({
                action: 'DELETE',
                module: 'Closeout Form',
                recordId: sreeningId,
                userInitials: userInitials || 'SYSTEM',
                oldValue: oldValue,
                newValue: null,
                reason: reason || 'Record deletion'
            });
            return res.status(200).json({ success: true, message: 'Deleted successfully' });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error, could not delete closeout form", error: error.message });
    }
}

export { createCloseoutForm, getAllCloseoutForms, getOneCloseoutForm, updateCloseoutForm, deleteCloseoutForm };
