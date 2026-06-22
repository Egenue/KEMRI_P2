import gestationAge from '../Models/gestationAge.js'
import { logAudit } from '../Utils/auditHelper.js';

const getOneGestAge = async (req, res) =>{
    try{
        const {screeningId} = req.params ;
        const exists = await gestationAge.findOne({screeningId});
        if(!exists){
            res.status(404).json({ });
        }else{
            res.status(200).json(exists);
        }
    }catch(error){
        res.status(500).json({"message": error.message});
    }
}

const getAllGestAge = async (req, res) => {
    try{
        const datas = await gestationAge.find() ;
        return res.status(200).json(datas);
    }catch (error){
        return res.status(500).json({"message": error.message});
    }
}

const createGestAge = async (req, res) => {
    try{
        let data = req.body;
        if (req.body.record) {
            data = { ...req.body.record, userInitials: req.body.userInitials, reason: req.body.reason };
        }
        const {
            screeningId,
            lmp,
            ultrasoundDate = {},
            lmpCertainty,
            enrolmentDate,
            estDueDate,
            currentGestAge = {},
            userInitials,
            reason
        } = data;

        const {usWeeks, usDays} = ultrasoundDate;
        const {gestweeks, gestdays} = currentGestAge;

        const existing = await gestationAge.findOne({screeningId: screeningId})
        if(existing){
            return res.status(409).json({"message":"This already exists!!!"});
        }else{
            const newGest = new gestationAge({
                screeningId,
                lmp,
                ultrasoundDate,
                lmpCertainty,
                enrolmentDate,
                estDueDate,
                currentGestAge
            });

            await newGest.save();
            await logAudit({
                action: 'CREATE',
                module: 'Gestation Age',
                recordId: screeningId,
                userInitials: userInitials || 'SYSTEM',
                oldValue: null,
                newValue: newGest,
                reason: reason || 'Initial Entry'
            });

            return res.status(200).json({"message":"Success!!!"});
        }
    }catch(error){
        return res.status(500).json({"message": error.message});
    }
}

const updateGestAge = async (req, res) => {
    try {
        let newForm = req.body;
        if (req.body.record) {
            newForm = { ...req.body.record, userInitials: req.body.userInitials, reason: req.body.reason };
        }
        const { userInitials, reason } = newForm;
        const oldValue = await gestationAge.findOne({ screeningId: newForm.screeningId });
        const updated = await gestationAge.findOneAndUpdate(
            { screeningId: newForm.screeningId },
            newForm,
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ "message": "Record not found" });
        }

        await logAudit({
            action: 'UPDATE',
            module: 'Gestation Age',
            recordId: newForm.screeningId,
            userInitials: userInitials || 'SYSTEM',
            oldValue: oldValue,
            newValue: updated,
            reason: reason || 'Data update'
        });

        return res.status(200).json({ "message": "Update Success!!!", data: updated });
    } catch (error) {
        return res.status(500).json({ "message": error.message });
    }
}

const deleteGestAge = async (req, res) => {
    try{
        const {screeningId} = req.params;
        const { userInitials, reason } = req.body;

        const oldValue = await gestationAge.findOne({ screeningId });
        const deleted = await gestationAge.findOneAndDelete({screeningId});

        if(!deleted){
            return res.status(404).json({"message":"Does Not exist"});
        }else{
            await logAudit({
                action: 'DELETE',
                module: 'Gestation Age',
                recordId: screeningId,
                userInitials: userInitials || 'SYSTEM',
                oldValue: oldValue,
                reason: reason || 'Record deletion'
            });
            return res.status(200).json({"message":"Success!!!"})
        }
    }catch(error){
        return res.status(500).json({"message": error.message});
    }
}

export {createGestAge, getAllGestAge, getOneGestAge, updateGestAge, deleteGestAge};