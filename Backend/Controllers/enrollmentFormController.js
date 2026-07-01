import EnrollmentForm from "../Models/enrollmentForm.js";
import screeningForm from "../Models/screeningForm.js";
import { logAudit } from '../Utils/auditHelper.js';
 
const getAllEnrollmentForms = async (req, res) => {
    try {
        const enrollmentData = await EnrollmentForm.find();
        return res.status(200).json(enrollmentData);
    } catch (error) {
        return res.status(500).json({ "message": "Could not get all enrollment forms", error: error.message });
    }
}

const newEnrollmentForm = async (req, res) => {
    try {
        let data = req.body;
        if (req.body.record) {
            data = { ...req.body.record, userInitials: req.body.userInitials, reason: req.body.reason };
        }
        const {
            screeningId,
            healthFacility,
            DoB,
            Age = {},
            maritalStatus,
            HusbandName,
            villageOfResidence,
            educationLevel,
            subjectOccupation,
            otherOccupation,
            height,
            weight,
            BMI,
            vitalSigns = {},
            estGestAge,
            gaParameters,
            userInitials,
            reason
        } = data;
        const {months, years} = Age;
        const { 
            temperature = {},
            respiratoryRate,
            pulseRate,
            bloodPressure = {}
        } = vitalSigns;
        const {value, location} = temperature;
        const {systolic,diastolic} = bloodPressure;

        if (!screeningId || !DoB || !healthFacility) {
            return res.status(400).json({
                message: "Please fill in all required fields: screeningId, DoB, and healthFacility."
            });
        }

        const exists = await EnrollmentForm.findOne({ screeningId });
        if (exists) {
            return res.status(409).json({ "message": "This enrollment form already exists !" });
        }

        const parentScreening = await screeningForm.findOne({ screeningId });
        if (!parentScreening) {
            return res.status(400).json({ "message": "Invalid Screening ID: No screening record found for this participant." });
        }

        const newForm = new EnrollmentForm({
            screeningId,
            healthFacility,
            DoB,
            Age,
            maritalStatus,
            HusbandName,
            villageOfResidence,
            educationLevel,
            subjectOccupation,
            otherOccupation,
            height,
            weight,
            BMI,
            vitalSigns,
            estGestAge,
            gaParameters,
            submittedAt: data.submittedAt || Date.now()
        });

        await newForm.save();
        await logAudit({
            action: 'CREATE',
            module: 'Enrollment Form',
            recordId: screeningId,
            userInitials: userInitials || 'SYSTEM',
            oldValue: null,
            newValue: newForm,
            reason: reason || 'Initial Entry'
        });
        return res.status(200).json({ newForm });
    } catch (error) {
        return res.status(500).json({ "message": "Could not create new Enrollment Form", error: error.message });
    }
}

const getOneEnrollmentForm = async (req, res) => {
    try {
        const { screeningId } = req.params;
        const enrolmentFormDoc = await EnrollmentForm.findOne({ screeningId: screeningId });
        if (!enrolmentFormDoc) {
            return res.status(404).json({ "message": "Enrollment form not found" });
        } else {
            return res.status(200).json(enrolmentFormDoc);
        }
    } catch (error) {
        return res.status(500).json({ message: "Error, could not get enrollment form", error: error.message });
    }
}

const updateEnrollmentForm = async (req, res) => {
    try {
        const screeningId = req.params.screeningId || req.body.screeningId;
        if(!screeningId){
            return res.status(400).json({"message":"screeningId is required"});
        }else{
            const newForm = req.body;
            const { userInitials, reason } = req.params;
            const oldValue = await EnrollmentForm.findOne({ screeningId: newForm.screeningId });
            const updatedData = await EnrollmentForm.findOneAndUpdate(
                {screeningId: newForm.screeningId},
                newForm,
                {new: true, runValidators: true}
            );

            if (!updatedData) {
                return res.status(404).json({ "message": "Enrollment form not found" });
            } else {
                await logAudit({
                    action: 'UPDATE',
                    module: 'Enrollment Form',
                    recordId: newForm.screeningId,
                    userInitials: userInitials || 'SYSTEM',
                    oldValue,
                    newValue: updatedData,
                    reason: reason || 'Data update'
                });
                return res.status(200).json({ "message": "Updated successfully", data: updatedData });
            }
        }
    } catch (error) {
        return res.status(500).json({ "message": "Error updating enrollment form", error: error.message });
    }
}

const deleteEnrollmentForm = async (req, res) => {
    try {
        const screeningId = req.params.screeningId || req.body.screeningId;
        const { userInitials, reason } = req.body;
        const oldValue = await EnrollmentForm.findOne({ screeningId });
        const deleted = await EnrollmentForm.findOneAndDelete({ screeningId });
        if (!deleted) {
            return res.status(404).json({ "message": "Enrollment form not found" });
        } else {
            await logAudit({
                action: 'DELETE',
                module: 'Enrollment Form',
                recordId: screeningId,
                userInitials: userInitials || 'SYSTEM',
                oldValue: oldValue,
                newValue: null,
                reason: reason || 'Record deletion'
            });
            return res.status(200).json({ success: true, message: 'Deleted successfully' });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error, could not delete enrollment form", error: error.message });
    }
}

export { newEnrollmentForm, getAllEnrollmentForms, getOneEnrollmentForm, updateEnrollmentForm, deleteEnrollmentForm };
