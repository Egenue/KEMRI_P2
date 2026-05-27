import gestationAge from '../Models/gestationAge.js'

const getOneGestAge = async (req, res) =>{
    try{
        const {screeningId} = req.params ;

        const exists = await gestationAge.findOne({screeningId});

        if(!exists){
            res.status(401).json({"message":"Not Found"});
        }else{
            res.status(200).json({
                "message":"Success", data:exists
            })
        }

    }catch(error){
        res.status(500).json({"message":"Eroor!!!", error: error.message});
    }
}

const getAllGestAge = async (req, res) => {
    try{
        const {screeningId} = req.params ;

        const datas = await gestationAge.find() ;
        if(!data){
            return res.status(404).jason({"message":"Not Found, Does Not exist"});
        }else{
            return res.status(200).json({"message":"Success!!", data: datas});
        }
    }catch (error){
        return res.status(500).json({"message":"Error!!!", error: error.message});
    }
}

const createGestAge = async (req, res) => {
    try{
        const{
            screeningId,
            lmp,
            ultrasoundDate = {},
            lmpCertainty,
            enrolmentDate
        } = req.body;

        const {usWeeks,usDays} = ultrasoundDate;

        const existing = await gestationAge.findOne({screeningId: screeningId})
        if(existing){
            return ("This already exisists!!!");
        }else{
            const newGest = new gestationAge({
            screeningId,
            lmp,
            ultrasoundDate,
            lmpCertainty,
            enrolmentDate
            });

            await newGest.save();

            return res.status(200).json({"message":"Success!!!"});
        }

    }catch(error){
        return res.status(500).json({"message":"Error!!!", error: error.message});
    }
}

const deleteGestAge = async (req, res) => {
    try{
        const {screeningId} = req.params;

        const exissitnDel = await gestationAge.findOneAndDelete({screeningId});

        if(!exissitnDel){
            return ("Does Not exist");
        }else{
            return RegExp.status(200).json({"message":"Success!!!"})
        }
    }catch(error){
        return res.status(500).json({"message":"Error!!!", eroor:error.message});
    }
}


export {createGestAge, getAllGestAge, getOneGestAge, deleteGestAge};