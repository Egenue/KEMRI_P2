import screeningForm  from "../Models/screeningForm.js";
import EnrollmentForm from "../Models/enrollmentForm.js";
import deliveryForm from "../Models/deliveryForm.js";
import closeoutForm from "../Models/closeoutForm.js";
import gestationAge from "../Models/gestationAge.js";
import { logAudit } from '../Utils/auditHelper.js';
import { cleanEmptyStrings } from '../Utils/cleanHelper.js';

const createScreeningForm = async (req, res) => {
    try {
        let data = req.body;
        if (req.body.record) {
            data = { ...req.body.record, userInitials: req.body.userInitials, reason: req.body.reason };
        }
        
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
        } = data;

        // 1. Root Level Validation
        if (!screeningId || !interviewDate || !healthFacility || !DoB || !height || !weight || !BMI || !fundalHeight) {
            return res.status(400).json({ "message": "Please fill in all required root-level metrics!" });
        }

        // 2. Nested Age Object Validation
        if (Age.months === undefined || Age.years === undefined) {
            return res.status(400).json({ "message": "Missing required age information (months and years)." });
        }

        // 3. Nested Vital Signs Validation
        const { temperature = {}, respiratoryRate, pulseRate, bloodPressure = {} } = vitalSigns;
        if (temperature.value === undefined || !temperature.location) {
            return res.status(400).json({ "message": "Temperature value and recording location are required." });
        }
        if (respiratoryRate === undefined || pulseRate === undefined) {
            return res.status(400).json({ "message": "Respiratory rate and pulse rate metrics are required." });
        }
        if (bloodPressure.systolic === undefined || bloodPressure.diastolic === undefined) {
            return res.status(400).json({ "message": "Blood pressure measurements (systolic/diastolic) are required." });
        }

        if (!inclusionCriteria.residentWithin15km || 
            !inclusionCriteria.pregnancyConfirmed || 
            !inclusionCriteria.gestationLessThan31Weeks || 
            !inclusionCriteria.consentsToHIVTesting || 
            !inclusionCriteria.willingToDeliverAtStudyHospital) {
            return res.status(400).json({ "message": "All inclusion criteria responses must be completed." });
        }

        if (!exclusionCriteria.multiplePregancy || 
            !exclusionCriteria.fisturaRepairOrSpinalDeformity || 
            !exclusionCriteria.unableToGiveInformedConsent) {
            return res.status(400).json({ "message": "All exclusion criteria responses must be completed." });
        }

        if (!eligibility.meetsAllCriteria) {
            return res.status(400).json({ "message": "Eligibility status evaluation is required." });
        }
        if (eligibility.meetsAllCriteria === "Yes" && !eligibility.consentedToParticipate) {
            return res.status(400).json({ "message": "Consent response is required when eligibility requirements are met." });
        }
        if (eligibility.consentedToParticipate === "No" && !eligibility.reasonForRefusal) {
            return res.status(400).json({ "message": "A reason for refusal must be provided if consent is declined." });
        }

        const exists = await screeningForm.findOne({ screeningId: screeningId });
        if (exists) {
            return res.status(409).json({ "message": "This form already exists" });
        }

        const newScreeningForm = new screeningForm({
            screeningId,
            interviewDate,
            healthFacility,
            DoB,
            Age: {
                months: Age.months,
                years: Age.years
            },
            height,
            weight,
            BMI,
            vitalSigns: {
                temperature: {
                    value: temperature.value,
                    location: temperature.location
                },
                respiratoryRate,
                pulseRate,
                bloodPressure: {
                    systolic: bloodPressure.systolic,
                    diastolic: bloodPressure.diastolic
                }
            },
            lastMenstrualPeriod: {
                date: lastMenstrualPeriod.date || Date.now(),
                unknown: lastMenstrualPeriod.unknown || false
            },
            fundalHeight,
            inclusionCriteria: {
                residentWithin15km: inclusionCriteria.residentWithin15km,
                pregnancyConfirmed: inclusionCriteria.pregnancyConfirmed,
                gestationLessThan31Weeks: inclusionCriteria.gestationLessThan31Weeks,
                consentsToHIVTesting: inclusionCriteria.consentsToHIVTesting,
                willingToDeliverAtStudyHospital: inclusionCriteria.willingToDeliverAtStudyHospital
            },
            exclusionCriteria: {
                multiplePregancy: exclusionCriteria.multiplePregancy,
                fisturaRepairOrSpinalDeformity: exclusionCriteria.fisturaRepairOrSpinalDeformity,
                unableToGiveInformedConsent: exclusionCriteria.unableToGiveInformedConsent
            },
            eligibility: {
                meetsAllCriteria: eligibility.meetsAllCriteria,
                consentedToParticipate: eligibility.consentedToParticipate || null,
                reasonForRefusal: eligibility.reasonForRefusal || null
            },
            createdAt: createdAt || Date.now(),
            updatedAt: updatedAt || Date.now()
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
        return res.status(200).json({ screeningDocs });
    } catch (error) {
        return res.status(500).json({ "message": "Failed operation", error: error.message });
    }
}

const updateScreeningForm = async (req, res) => {
    try {
        let newForm = req.body;
        if (req.body.record) {
            newForm = { ...req.body.record, userInitials: req.body.userInitials, reason: req.body.reason };
        }
        const { userInitials, reason } = newForm;
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
                recordId: newForm.screeningId,
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
        const screeningId = req.params.id || req.params.screeningId;
        const {userInitials} = req.body;
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
