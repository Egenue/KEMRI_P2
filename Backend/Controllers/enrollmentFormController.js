import enrollmentForm from "../Models/enrollmentForm.js";
 
const getAllEnrollmentForms = async (req, res) => {
    try{
        const data = await enrollmentForm.find();
    }
    catch(error){
        return("Could not fetch data: ", error)
    }
}

const newEnrollmentForm = async (req, res) => {
    try{
        const {
            screeningId,
            healthFacility,
            DoB,
            Age:{
                months,
                years
            },
            maritalStatus,
            husbandName,
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
        } = req.body;
        
        if (!screeningId || !DoB || !healthFacility) {
            return res.status(400).json({
                message: "Please fill in all required fields: screeningId, DoB, and healthFacility."
            });
        }
        const exists = await enrollmentForm.finOne({$or: [screeningId, HusbandName]});
        if (exists){
            return ('This enrollment form aready exists !')
        }
        const newEnrollmentForm = new enrollmentForm({
            screeningId,
            healthFacility,
            DoB,
            Age:{
                months,
                years
            },
            maritalStatus,
            husbandName,
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

    await newEnrollmentForm.save();

    return res.status(200).json({"message":"Enrolment Form Saved", data: newEnrollmentForm});
    }
    catch(error){
        return ("Could not save new enrollment form: ", error);
    }
    
}

const getOneEnrollmentForm = async (req, res) => {
    try{
        const {id} = req.params;
        const enrolmentFormDoc = await enrollmentForm.findOneById(id);
        if(!enrolmentFormDoc){
            return res.status(404).json({"message":"Enrollment form not found"});
        }

        return res.status(200).json({"message":"Enrollment form found", data: enrolmentFormDoc});
    }
    catch(error){
        return ("Error, could not get enrollmentForm : ", error)
    }
}

const deleteEnrollmentForm = async (req, res) => {
    try{
        const {id} = req.params;
        const enrolmentFormDoc = await enrollmentForm.findOneById(id);
        if(!enrolmentFormDoc){
           return res.status(404).json({"message":"Enrollment form not found"});
        }
        enrolmentFormDoc.delete((err, results) => {
            if (err) {
                return res.status(500).json({ success: false, error: err.message });
            } else {
                res.status(200).json({ success: true, message: 'Deleted successfully' });
            }
        });
    }catch(error){
        return ("Error, Could not delete enrollment form", error);
    }
}

export default {newEnrollmentForm, getAllEnrollmentForms, getOneEnrollmentForm, deleteEnrollmentForm};