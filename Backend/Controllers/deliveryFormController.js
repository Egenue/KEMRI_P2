import deliveryForm from '../Models/deliveryForm.js';

const createDeliveryForm = async (req, res) => {
    try{
        const {
            interviewDate,
            deliveryScreeningId,
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
            deliveryScreeningId,
            interviewDate,
            physicalExam ,
            bodyMassIndex ,
            motherAbnormality ,
            deliveryHistory ,
            closeOut
        });

        const exists = await deliveryForm.findOne({deliveryScreeningId});

        if (!deliveryScreeningId || !interviewDate || !bodyMassIndex){
            return res.status(400).json({"message":"Please fill in all fields"});
        }else if(exists){
            return res.status(409).json({"message":"Form already exists !!"});
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
        const deliveryFormData = await deliveryForm.find({});
        return res.status(200).json({data:deliveryFormData});
    }catch (error){
        return res.status(500).json({"message":"ERROR!! Could not get delivery form: ", error: error.message});
    }
}

const getOneDeliveryForm = async (req, res) => {
    try{
        const id = req.body.deliveryScreeningId ;
        const delFormData = await deliveryForm.findOne({
            $or:[{deliveryScreeningId:req.body.deliveryScreeningId}]
        });

        if(!delFormData){
            return res.status(404).json("Form not found !!");
        }else{
            return res.status(200).json({data:delFormData});
        }
    }catch (error){
        return res.status(500).json({"message":"Operation failed: ", error: error.message});
    }
}

const deleteOneDeliveryForm = async (req, res) => {
    try{
        const id = req.body.deliveryScreeningId;
        const oneDelveryForm = await deliveryForm.findOne({deliveryScreeningId: id});
        if(!oneDelveryForm){
            return res.status(404).json({"message":"Form not found"});
        }else{
            await deliveryForm.findOneAndDelete({deliveryScreeningId: id});
            return res.status(200).json({ success: true, message: 'Deleted successfully' });
        }
    }catch(error){
        return res.status(500).json({ message: "Error, could not delete delivery form", error: error.message });
    }
}

export {createDeliveryForm, getdeliveryForms, getOneDeliveryForm, deleteOneDeliveryForm};