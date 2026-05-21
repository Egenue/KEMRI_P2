import EnrollmentForm from "../Models/enrollmentForm";
import screeningForm  from "../Models/screeningForm";

const createScreeningForm = async (req, res) => {
    try{
        const {
        screeningId,
        interviewDate,
        healthFacility,
        DoB,
        Age = {},
        height,
        weight,
        vitalSigns = {},
        lastMenstrualPeriod = {},
        fundalHeight,
        inclusionCriteria = {},
        exclusionCriteria = {},
        eligibility = {},
        createdAt,
        updatedAt
    } = req.body ;

    const {meetsAllCriteria,consentedToParticipate,reasonForRefusal,refusalDetails} = eligibility ;

    const {multiplePregancy,fisturaRepairOrSpinalDeformity,unableToGiveInformedConsent} = exclusionCriteria ;

    const {
        residentWithin15km,
        pregnancyConfirmed,
        gestationLessThan31Weeks,
        consentsToHIVTesting,
        willingToDeliverAtStudyHospital
    } = inclusionCriteria ;

    const { lmpdate,lmpunknown} = lastMenstrualPeriod ; 

    const {temperature = {},respiratoryRate,pulseRate,bloodPressure = {}} = vitalSigns;

    const {value,location} = temperature;

    const {systolic,diastolic} = bloodPressure ;

    const { months, years} = Age ;

    const newScreeningForm = new screeningForm({
        screeningId,
        interviewDate,
        healthFacility,
        DoB,
        Age ,
        height,
        weight,
        vitalSigns,
        lastMenstrualPeriod,
        fundalHeight,
        inclusionCriteria ,
        exclusionCriteria ,
        eligibility ,
        createdAt,
        updatedAt
    });

    const exists = screeningForm.findOne({
        $or:[
            {screeningId: screeningId}
        ]
    })

    if (!screeningId || !interviewDate || !healthFacility || !DoB){
        return res.status(404).json({"message":"Please fill in the required fields !!"});
    }else if(exists){
        return res.status(405).json({"message":"This form already exists"}) ;
    }else{
        await newScreeningForm.save();
        return res.status(200).json({"message":"Successful!! Form saved", data: newScreeningForm});
    }

    }catch(error){
        return res.status(500).json({"message":"Error!! Could not create new Screening form", error: error.message});
    }
}

const getOneScreeningForm = async (req, res) => {
    try{
        const existing = await screeningForm.findOne({
            $or: [{screeningId: req.body.screeningId}]
        }) ;

        if(!exists){
            return res.status(404).json({"message":"The screening form was not found !!"});
        }else{
            return res.status(201).json({"message":"Screening form found !!", data: existing});
        }

    }catch (error){
        return res.status(500).json({"message":"Operation failed", error: erro.message});
    }
}

const getAllSreeningForms = async (req, res) =>{
    try{
        const screeningDocs = await screeningForm.find({});
        if(!screeningDocs){
            return res.status(404).json({"message":"Screening froms not found"})
        }else{
            return res.status(201).json({"message":"Screening forms found !!", data: screeningDocs});
        }
    }catch (error){
        return res.status(500).json({"message":"Failed operation", error: error.message});
    }
}

const deleteScreeningForm = async (req, res) => {
    try{
        const deleteForm = await screeningForm.findOne({
            $or: [
                {screeningId: req.body.screeningId}
            ]
        });

        if (!deleteForm){
            return res.status(404).json({"message":"Screening form does not exist"});
        }else{
            await screeningForm.findOneAndDelete({
                $or:[
                    {screeningId: req.body.screeningId}
                ]
            })
        }
    }catch(error){
        return res.status(500).json({"message":"Could not delete form", error: eroor.message});
    }
}

export {createScreeningForm, getAllSreeningForms, getOneScreeningForm, deleteScreeningForm}