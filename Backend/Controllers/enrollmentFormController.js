import EnrollmentForm from "../Models/enrollmentForm.js";
 
const getAllEnrollmentForms = async (req, res) => {
    try {
        const enrollmentData = await EnrollmentForm.find({});
        return res.status(200).json({ data: enrollmentData });
    } catch (error) {
        return res.status(500).json({ "message": "Could not get all enrollment forms", error: error.message });
    }
}

const newEnrollmentForm = async (req, res) => {
    try {
        const {
            screeningId,
            healthFacility,
            DoB,
            Age = {},
            maritalStatus,
            HusbandName,
            villageOfResidence,
            educationLevel,
            subjectOccupation,
            otherOccupation,
            height,
            weight,
            vitalSigns = {},
            estGestAge,
            gaParameters
        } = req.body;

        if (!screeningId || !DoB || !healthFacility) {
            return res.status(400).json({
                message: "Please fill in all required fields: screeningId, DoB, and healthFacility."
            });
        }

        const exists = await EnrollmentForm.findOne({ screeningId });
        if (exists) {
            return res.status(409).json({ "message": "This enrollment form already exists !" });
        }

        const newForm = new EnrollmentForm({
            screeningId,
            healthFacility,
            DoB,
            Age,
            maritalStatus,
            HusbandName,
            villageOfResidence,
            educationLevel,
            subjectOccupation,
            otherOccupation,
            height,
            weight,
            vitalSigns,
            estGestAge,
            gaParameters
        });

        await newForm.save();
        return res.status(200).json({ data: newForm });
    } catch (error) {
        return res.status(500).json({ "message": "Could not create new Enrollment Form", error: error.message });
    }
}

const getOneEnrollmentForm = async (req, res) => {
    try {
        const { id } = req.params;
        const enrolmentFormDoc = await EnrollmentForm.findOne({ screeningId: id });
        if (!enrolmentFormDoc) {
            return res.status(404).json({ "message": "Enrollment form not found" });
        } else {
            return res.status(200).json({ "message": "Enrollment form found", data: enrolmentFormDoc });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error, could not get enrollment form", error: error.message });
    }
}

const updateEnrollmentForm = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = await EnrollmentForm.findOneAndUpdate(
            { screeningId: id },
            req.body,
            { new: true }
        );

        if (!updatedData) {
            return res.status(404).json({ "message": "Enrollment form not found" });
        } else {
            return res.status(200).json({ "message": "Updated successfully", data: updatedData });
        }
    } catch (error) {
        return res.status(500).json({ "message": "Error updating enrollment form", error: error.message });
    }
}

const deleteEnrollmentForm = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await EnrollmentForm.findOneAndDelete({ screeningId: id });
        if (!deleted) {
            return res.status(404).json({ "message": "Enrollment form not found" });
        } else {
            return res.status(200).json({ success: true, message: 'Deleted successfully' });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error, could not delete enrollment form", error: error.message });
    }
}

export { newEnrollmentForm, getAllEnrollmentForms, getOneEnrollmentForm, updateEnrollmentForm, deleteEnrollmentForm };
