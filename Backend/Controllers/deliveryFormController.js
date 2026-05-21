import deliveryForm from '../Models/deliveryForm.js';

const createDeliveryForm = async (req, res) => {
    try{
        const {
            interviewDate,
            deliverySreeningId,
            physicalExam = {},
            bodyMassIndex = {},
            motherAbnormality = {},
            deliveryHistory = {},
            closeOut = {}
        } = req.body;

        const {motherAbnomValue,specifics} = motherAbnormality

        const {unknown,value} = bodyMassIndex ;

        const {motherWeight,vitalSigns = {}} = physicalExam ;

        const {temperature = {},respiratoryRate,pulseRate,bloodPressure = {}, oxygenSaturation = {}} = vitalSigns;

        const {systolic,diastolic} = bloodPressure ;

        const {tempValue, location} = temperature ;

        const {oxygenValue, oxygenOptions} = oxygenSaturation ;

        const {closeOutInterviewDate,sreeningId,dateOfTermination,participantStatus = {}} = closeOut ;

        const {choicesStudy,incompleteReason = {}} = participantStatus ;

        const {incompletionOptions,adverseEvent,deathOption,protocalDeviation,withdrawalReason,otherReason} = incompleteReason;

        const {deliveryDate,deliveryTime,deliveryPlace = {},deliveryPersonnel = {},deliveryMode = {}} = deliveryHistory ;

        const {deliveryPersValue,otherPersonnel} = deliveryPersonnel;

        const {deliveryChoices,otherLocation,otherFacility} = deliveryPlace ;

        const {choices,otherMode,csectionIndication = {}} = deliveryMode ;

        const {csectOptions,otherOption} = csectionIndication;

        const newDeliveryForm = new deliveryForm({
            deliverySreeningId,
            interviewDate,
            physicalExam ,
            bodyMassIndex ,
            motherAbnormality ,
            deliveryHistory ,
            closeOut
        });

        const id = req.body.deliverySreeningId ;

        const exists = await deliveryForm.findById(id);

        if (!interviewDate || !bodyMassIndex){
            return res.status(500).json({"message":"Please fill in all fields"});
        }else if(exists){
            res.status(404).json({"message":"Form already exists !!"});
        }else{
            await newDeliveryForm.save();
            return res.status(200).json({"message":"Data saved successfully", data: newDeliveryForm});
        }
    }catch(error){
        return res.status(500).json({"message":"Error, Could not create new form", error: error.message});
    }
    
}

const getdeliveryForms = async (req, res) => {
    try{
        const deliveryFormData = await deliveryForm.find();
        return res.status(200).json({data:deliveryFormData});
    }catch (error){
        return ("ERROR!! Could not get delivery form: ", error);
    }
}

const getOneDeliveryForm = async (res, req) => {
    try{
        const id = req.body.deliverySreeningId;
        const delFormData = await deliveryForm.findById(id);

        if(!delFormData){
            res.status(200).json("Form not found !!");
        }else{
            res.status(200).json({data:delFormData});
        }
    }catch (error){
        return ("Operation failed: ", error);
    }
}

const deleteOneDeliveryForm = async (req, res) => {
    try{
        const id = req.body.deliverySreeningId;
        const oneDelveryForm = await deliveryForm.findById(id);
        if(!oneDelveryForm){
            return res.status(401).json({"message":"Form not found"});
        }else{
            await oneDelveryForm.findByIdAndDelete(id);
            res.status(200).json({ success: true, message: 'Deleted successfully' });
        }
    }catch(error){
        return res.status(500).json({ message: "Error, could not delete enrollment form", error: error.message });
    }
}

export {createDeliveryForm, getdeliveryForms, getOneDeliveryForm, deleteOneDeliveryForm};