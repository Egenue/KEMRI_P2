import ancVisit from '../Models/ancVisit.js';
import { logAudit } from '../Utils/auditHelper.js';

const createAncVisit = async (req, res) => {
    try{
        const{
            visitNumber,
            visitDate,
            gestationAge = {},
            weightKilos,
            bloodPressure = {},
            fundalHeight,
            muac,
            complaints,
            medicationGiven,
            nextAppointment,
            userInitials,
            reason
        } = req.body;

        const {gestationWeeks, gestDays} = gestationAge;
        const {systolic, diastolic} = bloodPressure;

        const newAncVisit = new ancVisit({
            visitNumber,
            visitDate,
            gestationAge,
            weightKilos,
            bloodPressure,
            fundalHeight,
            muac,
            complaints,
            medicationGiven,
            nextAppointment
        });

        if(!visitNumber || !visitDate){
            return res.status(400).json({"message":"Please fill in all the required fields"});
        }else{
            await newAncVisit.save();
            await logAudit({
                action: 'CREATE',
                module: 'ANC Visit',
                recordId: visitNumber,
                userInitials: userInitials || 'SYSTEM',
                oldValue: null,
                newValue: newAncVisit,
                reason: reason || 'Initial Entry'
            });
            res.status(201).json({"message":"ANC Visit Form created successfully", ancVisit: newAncVisit});
        }
    }catch(error){
        res.status(500).json({"message":"Error Creating ANC Visit Form", error: error.message});
    }   
}

const getOneAnc = async(req, res) =>{
    try{
        const {visitNumber} = req.params;
        const foundOne = await ancVisit.findOne({visitNumber});
        if(!foundOne){
            return res.status(404).json({"message":"ANC Visit Form not found"});
        }else{
            return res.status(200).json(foundOne);
        }
    }catch(error){
        res.status(500).json({"message":"Error fetching ANC Visit Form", error: error.message});
    }
}

const getAllAnc = async (req, res) => {
    try{
        const allAnc = await ancVisit.find();
        return res.status(200).json(allAnc);
    }catch(error){
        return res.status(500).json({"message":"Error Getting ANC Forms", error: error.message});
    }
}

const deleteOneAnc = async (req, res) => {
    try{
        const {visitNumber} = req.params;
        const { userInitials, reason } = req.body;
        const existing = await ancVisit.findOne({visitNumber});
        if (!existing){
            return res.status(404).json({"message":"ANC Form Not Found !!!"});
        }else{
            await ancVisit.findOneAndDelete({visitNumber});
            await logAudit({
                action: 'DELETE',
                module: 'ANC Visit',
                recordId: visitNumber,
                userInitials: userInitials || 'SYSTEM',
                oldValue: existing,
                reason: reason || 'Record deletion'
            });
            return res.status(200).json({"message":"ANC Form Successfully Deleted "});
        }
    }catch (error){
        return res.status(500).json({"message":"Error Deleting The ANC Form", error: error.message});
    }
}

export {createAncVisit, getOneAnc, getAllAnc, deleteOneAnc};