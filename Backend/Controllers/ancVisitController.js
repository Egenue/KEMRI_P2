import ancVisit from '../Models/ancVisit.js';

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
            nextAppointment
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
            return res.status(200).json({"message":"ANC Visit Form Found !!!", data: foundOne});
        }
    }catch(error){
        res.status(500).json({"message":"Error fetching ANC Visit Form", error: error.message});
    }
}