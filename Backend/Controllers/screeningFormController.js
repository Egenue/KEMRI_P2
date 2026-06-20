import screeningForm  from "../Models/screeningForm.js";
import EnrollmentForm from "../Models/enrollmentForm.js";
import deliveryForm from "../Models/deliveryForm.js";
import closeoutForm from "../Models/closeoutForm.js";
import gestationAge from "../Models/gestationAge.js";
import { logAudit } from '../Utils/auditHelper.js';

const createScreeningForm = async (req, res) => {
    try {
        const {
            screeningId,
            interviewDate,
            healthFacility,
            DoB,
            Age = {},
            height,
            weight,
            BMI,
            vitalSigns = {},
            lastMenstrualPeriod = {},
            fundalHeight,
            inclusionCriteria = {},
            exclusionCriteria = {},
            eligibility = {},
            createdAt,
            updatedAt,
            userInitials,
            reason
        } = req.body;
        const { userInitials } = req.body;
        
        const {months, years} = Age;
        const { 
            temperature = {},
            respiratoryRate,
            pulseRate,
            bloodPressure = {}
        } = vitalSigns;
        const {date, unknown} = lastMenstrualPeriod;
        const {value, location} = temperature;
        const {systolic,diastolic} = bloodPressure;
        const {
            residentWithin15km,
            pregnancyConfirmed,
            gestationLessThan31Weeks,
            consentsToHIVTesting,
            willingToDeliverAtStudyHospital
        } = inclusionCriteria;
        const {multiplePregancy, fisturaRepairOrSpinalDeformity, unableToGiveInformedConsent} = exclusionCriteria;
        const {
            meetsAllCriteria,
            consentedToParticipate,
            reasonForRefusal
        } = eligibility

        // Validate required fields FIRST
        if (!screeningId || !interviewDate || !healthFacility || !DoB) {
            return res.status(400).json({ "message": "Please fill in the required fields !!" });
        }

        const exists = await screeningForm.findOne({screeningId: screeningId});

        if (exists) {
            return res.status(409).json({ "message": "This form already exists" });
        }

        const newScreeningForm = new screeningForm({
            screeningId,
            interviewDate,
            userInitials,
            healthFacility,
            DoB,
            Age,
            height,
            weight,
            BMI,
            vitalSigns,
            lastMenstrualPeriod,
            fundalHeight,
            inclusionCriteria,
            exclusionCriteria,
            eligibility,
            createdAt,
            updatedAt
        });

        await newScreeningForm.save();
        await logAudit({
            action: 'CREATE',
            module: 'Screening Form',
            recordId: screeningId,
            userInitials: userInitials || 'SYSTEM',
            oldValue: null,
            newValue: newScreeningForm,
            reason: reason || 'Initial Entry'
        });
        return res.status(200).json({ "message": "Successful!! Form saved", data: newScreeningForm });

    } catch (error) {
        console.error('Screening form creation error:', error);
        return res.status(500).json({ "message": "Error!! Could not create new Screening form", error: error.message });
    }
}

const getOneScreeningForm = async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await screeningForm.findOne({ screeningId: id });

        if (!existing) {
            return res.status(404).json({ "message": "The screening form was not found !!" });
        } else {
            return res.status(200).json({ existing });
        }

    } catch (error) {
        return res.status(500).json({ "message": "Operation failed", error: error.message });
    }
}

const getAllSreeningForms = async (req, res) => {
    try {
        const screeningDocs = await screeningForm.find({});
        return res.status(200).json(screeningDocs);
    } catch (error) {
        return res.status(500).json({ "message": "Failed operation", error: error.message });
    }
}

const updateScreeningForm = async (req, res) => {
    try {
        const newForm = req.body;
        const { userInitials } = req.body;
        const oldValue = await screeningForm.findOne({ screeningId: newForm.screeningId});
        const updatedData = await screeningForm.findOneAndUpdate(
            { screeningId: newForm.screeningId },
            newForm,
            {new: true, runValidators:true}
        );

        if (!updatedData) {
            return res.status(404).json({ "message": "Screening form not found !!" });
        } else {
            await logAudit({
                action: 'UPDATE',
                module: 'Screening Form',
                recordId: id,
                userInitials: userInitials || 'SYSTEM',
                oldValue,
                newValue: updatedData,
                reason: reason || 'Data update'
            });
            return res.status(200).json({ "message": "Updated successfully", data: updatedData });
        }
    } catch (error) {
        return res.status(500).json({ "message": "Error updating screening form", error: error.message });
    }
}

const deleteScreeningForm = async (req, res) => {
    try {
        const { screeningId } = req.params;
        const { userInitials} = req.body;
        const reason = "Record deletion (Cascaded)";

        const oldValue = await screeningForm.findOne({ screeningId: screeningId });
        const deleted = await screeningForm.findOneAndDelete({ screeningId: screeningId });

        if (!deleted) {
            return res.status(404).json({ "message": "Screening form does not exist" });
        } else {
            await logAudit({
                action: 'DELETE',
                module: 'Screening Form',
                recordId: screeningId,
                userInitials: userInitials || 'SYSTEM',
                oldValue: oldValue,
                reason: reason
            });
            // Cascade delete ALL associated records across all study modules
            await Promise.all([
                EnrollmentForm.deleteMany({ screeningId: screeningId }),
                closeoutForm.deleteMany({ sreeningId: screeningId }),
                gestationAge.deleteMany({ screeningId: screeningId })
            ]);

            return res.status(200).json({ "message": "Deleted successfully and cascaded to all modules", success: true });
        }
    } catch (error) {
        return res.status(500).json({ "message": "Could not delete form", error: error.message });
    }
}

export { createScreeningForm, getAllSreeningForms, getOneScreeningForm, updateScreeningForm, deleteScreeningForm }
