import closeoutForm from '../Models/closeoutForm.js';

const createCloseoutForm = async (req, res) => {
    try {
        const {
            sreeningId,
            closeOutInterviewDate,
            dateOfTermination,
            participantStatus,
            submittedBy
        } = req.body;

        const exists = await closeoutForm.findOne({ sreeningId });

        if (!sreeningId || !closeOutInterviewDate || !dateOfTermination || !participantStatus) {
            return res.status(400).json({ "message": "Please fill in all required fields" });
        } else if (exists) {
            return res.status(409).json({ "message": "Closeout record already exists for this Screening ID" });
        } else {
            const newCloseoutForm = new closeoutForm({
                sreeningId,
                closeOutInterviewDate,
                dateOfTermination,
                participantStatus,
                submittedBy
            });
            await newCloseoutForm.save();
            return res.status(200).json({ "message": "Closeout data saved successfully", data: newCloseoutForm });
        }
    } catch (error) {
        return res.status(500).json({ "message": "Error, could not create closeout form", error: error.message });
    }
}

const getAllCloseoutForms = async (req, res) => {
    try {
        const closeoutData = await closeoutForm.find({});
        return res.status(200).json({ data: closeoutData });
    } catch (error) {
        return res.status(500).json({ "message": "ERROR!! Could not get closeout forms", error: error.message });
    }
}

const getOneCloseoutForm = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await closeoutForm.findOne({ sreeningId: id });

        if (!data) {
            return res.status(404).json({ "message": "Closeout form not found" });
        } else {
            return res.status(200).json({ data });
        }
    } catch (error) {
        return res.status(500).json({ "message": "Operation failed", error: error.message });
    }
}

const updateCloseoutForm = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = await closeoutForm.findOneAndUpdate(
            { sreeningId: id },
            req.body,
            { new: true }
        );

        if (!updatedData) {
            return res.status(404).json({ "message": "Closeout form not found" });
        } else {
            return res.status(200).json({ "message": "Updated successfully", data: updatedData });
        }
    } catch (error) {
        return res.status(500).json({ "message": "Error updating closeout form", error: error.message });
    }
}

const deleteCloseoutForm = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await closeoutForm.findOneAndDelete({ sreeningId: id });
        if (!deleted) {
            return res.status(404).json({ "message": "Closeout form not found" });
        } else {
            return res.status(200).json({ success: true, message: 'Deleted successfully' });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error, could not delete closeout form", error: error.message });
    }
}

export { createCloseoutForm, getAllCloseoutForms, getOneCloseoutForm, updateCloseoutForm, deleteCloseoutForm };
