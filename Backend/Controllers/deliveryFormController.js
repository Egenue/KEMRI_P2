import deliveryForm from '../Models/deliveryForm.js';
import { logAudit } from '../Utils/auditHelper.js';

const createDeliveryForm = async (req, res) => {
    try {
        const {
            interviewDate,
            deliveryScreeningId,
            physicalExam = {},
            bodyMassIndex = {},
            motherAbnormality = {},
            deliveryHistory = {},
            userInitials,
            reason
        } = req.body;
        const {motherWeight, vitalSigns = {} } = physicalExam;
        const {
            temperature = {},
            respiratoryRate,
            pulseRate,
            bloodPressure = {},
            oxygenSaturation = {}
        } = vitalSigns ;
        const {tempValue, location} = temperature;
        const {systolic, diastolic} = bloodPressure;
        const {oxygenValue, oxygenOptions} = oxygenSaturation;
        const {value, unknown} = bodyMassIndex;
        const {motherAbnomValue, specifics} = motherAbnormality;
        const {
            deliveryDate,
            deliveryTime,
            deliveryPlace = {},
            deliveryPersonnel = {},
            deliveryMode = {}
        } = deliveryHistory;
        const {deliveryChoices,otherLocation,otherFacility} = deliveryPlace;
        const {deliveryPersValue, otherPersonnel} = deliveryPersonnel;
        const {choices, otherMode, csectionIndication = {}} = deliveryMode;
        const {csectOptions, otherOption} = csectionIndication;
        const { userInitials } = req.body;

        if (!deliveryScreeningId || !interviewDate) {
            return res.status(400).json({ "message": "Please fill in required fields: deliveryScreeningId and interviewDate" });
        }

        const exists = await deliveryForm.findOne({ deliveryScreeningId });
        if (exists) {
            return res.status(409).json({ "message": "Form already exists !!" });
        }

        const newDeliveryForm = new deliveryForm({
            deliveryScreeningId,
            interviewDate,
            physicalExam,
            bodyMassIndex,
            motherAbnormality,
            deliveryHistory
        });

        await newDeliveryForm.save();
        await logAudit({
            action: 'CREATE',
            module: 'Delivery Form',
            recordId: deliveryScreeningId,
            userInitials: userInitials || 'SYSTEM',
            oldValue: null,
            newValue: newDeliveryForm,
            reason: reason || 'Initial Entry'
        });
        return res.status(200).json({ "message": "Data saved successfully", data: newDeliveryForm });
    } catch (error) {
        return res.status(500).json({ 
            "message": "Error, Could not create new form", 
            error: error.message,
            details: error.errors || error 
        });
    }
}

const getdeliveryForms = async (req, res) => {
    try {
        const deliveryFormData = await deliveryForm.find();
        return res.status(200).json(deliveryFormData);
    } catch (error) {
        return res.status(500).json({ "message": "ERROR!! Could not get delivery forms", error: error.message });
    }
}

const getOneDeliveryForm = async (req, res) => {
    try {
        const { deliveryScreeningId } = req.params;
        const delFormData = await deliveryForm.findOne({ deliveryScreeningId: deliveryScreeningId });

        if (!delFormData) {
            return res.status(404).json({ "message": "Form not found !!" });
        } else {
            return res.status(200).json(delFormData);
        }
    } catch (error) {
        return res.status(500).json({ "message": "Operation failed", error: error.message });
    }
}

const updateDeliveryForm = async (req, res) => {
    try {
        const newDelivery = req.body;
        const { userInitials } = req.body;
        const oldValue = await deliveryForm.findOne({ deliveryScreeningId: newDelivery.deliveryScreeningId});
        const updatedData = await deliveryForm.findOneAndUpdate(
            { deliveryScreeningId: newDelivery.deliveryScreeningId },
            newDelivery,
            { new: true, runValidators:true}
        );

        if (!updatedData) {
            return res.status(404).json({ "message": "Delivery form not found" });
        } else {
            await logAudit({
                action: 'UPDATE',
                module: 'Delivery Form',
                recordId: newDelivery.deliveryScreeningId,
                userInitials: userInitials || 'SYSTEM',
                oldValue: oldvalue,
                newValue: newDelivery,
                reason: newDelivery.reason || 'Data update'
            });
            return res.status(200).json({ "message": "Updated successfully", data: updatedData });
        }
    } catch (error) {
        return res.status(500).json({ "message": "Error updating delivery form", error: error.message });
    }
}

const deleteOneDeliveryForm = async (req, res) => {
    try {
        const newDelivery = req.body;
        const { userInitials } = req.body;
        const deleted = await deliveryForm.findOneAndDelete({ deliveryScreeningId: newDelivery.deliveryScreeningId });
        if (!deleted) {
            return res.status(404).json({ "message": "Form not found" });
        } else {
            await logAudit({
                action: 'DELETE',
                module: 'Delivery Form',
                recordId: newDelivery.deliveryScreeningId,
                userInitials: userInitials || 'SYSTEM',
                oldValue: newDelivery,
                newValue: null,
                reason: reason || 'Record deletion'
            });
            return res.status(200).json({ success: true, message: 'Deleted successfully' });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error, could not delete delivery form", error: error.message });
    }
}

export { createDeliveryForm, getdeliveryForms, getOneDeliveryForm, updateDeliveryForm, deleteOneDeliveryForm };
