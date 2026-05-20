import express from 'express';
import {newEnrollmentForm, getAllEnrollmentForms, getOneEnrollmentForm, deleteEnrollmentForm} from '../Controllers/enrollmentFormController';

const routes = express.Router();

// Enrollment Form Routes//
routes.get('/getAll', getAllEnrollmentForms);
routes.post('/createNew', newEnrollmentForm);
routes.get("/getOne/:id", getOneEnrollmentForm);
routes.delete("/deleteOne/:id", deleteEnrollmentForm);



export default routes;