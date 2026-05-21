import EnrollmentForm from "../Models/enrollmentForm.js";
 
const getAllEnrollmentForms = async (req, res) => {
    try{
        const enrollmentData = await EnrollmentForm.find({});
        return res.status(200).json({data:enrollmentData});
    }
    catch(error){
        return res.status(500).json({"message":"Could not get all emrollment forms", error: error.message})
    }
}

const newEnrollmentForm = async (req, res) => {
    try{
        const {
            screeningId,
            healthFacility,
            DoB,
            Age:{months,years},
            maritalStatus,
            HusbandName,
            villageOfResidence,
            educationLevel,
            subjectOccupation,
            otherOccupation,
            height,
            weight,
            vitalSigns:{
                temperature:{value,location},
                respiratoryRate,
                pulseRate,
                bloodPressure:{systolic,diastolic}
            },
            estGestAge
        } = req.body;

        const newEnrollmentForm = new EnrollmentForm({
            screeningId,
            healthFacility,
            DoB,
            Age:{
                months,
                years
            },
            maritalStatus,
            HusbandName,
            villageOfResidence,
            educationLevel,
            subjectOccupation,
            otherOccupation,
            height,
            weight,
            vitalSigns:{
                temperature:{
                    value,
                    location
                },
                respiratoryRate,
                pulseRate,
                bloodPressure:{
                    systolic,diastolic
                }
            },
            estGestAge
        });
        
        if (!screeningId || !DoB || !healthFacility) {
            return res.status(400).json({
                message: "Please fill in all required fields: screeningId, DoB, and healthFacility."
            });
        }
        const exists = await EnrollmentForm.findOne({
            $or: [
                {screeningId: req.body.screeningId},
                {HusbandName: req.body.HusbandName}
            ]
        });
        if (exists){
            return ('This enrollment form aready exists !')
        }else{
            await newEnrollmentForm.save();
            return res.status(200).json({data: newEnrollmentForm});
        }
    }
    catch(error){
        return res.status(500).json({"message":"Could not create new Enrollment Form", error:error.message});
    }
    
}

const getOneEnrollmentForm = async (req, res) => {
    try{
        const {id} = req.params;
        const enrolmentFormDoc = await EnrollmentForm.findById(id);
        if(!enrolmentFormDoc){
            return res.status(404).json({"message":"Enrollment form not found"});
        }else{
            return res.status(201).json({"message":"Enrollment form found", data: enrolmentFormDoc});
        }
    }
    catch(error){
        return res.status(500).json({ message: "Error, could not get enrollment form", error: error.message });
    }
}

const deleteEnrollmentForm = async (req, res) => {
    try{
        const {id} = req.params;
        const enrolmentFormDoc = await EnrollmentForm.findById(id);
        if(!enrolmentFormDoc){
           return res.status(404).json({"message":"Enrollment form not found"});
        }else{
            await enrolmentFormDoc.findByIdAndDelete(id)
            res.status(200).json({ success: true, message: 'Deleted successfully' });
        }
    }
    catch(error){
        return res.status(500).json({ message: "Error, could not delete enrollment form", error: error.message });
    }
}

export {newEnrollmentForm, getAllEnrollmentForms, getOneEnrollmentForm, deleteEnrollmentForm};