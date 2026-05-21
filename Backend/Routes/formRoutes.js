import express from 'express';
import { createLogin, getAllLogins, getLoginById, deleteLogin, userLogin } from '../Controllers/loginController.js';
import {newEnrollmentForm, getAllEnrollmentForms, getOneEnrollmentForm, deleteEnrollmentForm} from '../Controllers/enrollmentFormController.js';
import {createDeliveryForm, getdeliveryForms, getOneDeliveryForm, deleteOneDeliveryForm} from '../Controllers/deliveryFormController.js'
import {createScreeningForm, getAllSreeningForms, getOneScreeningForm, deleteScreeningForm} from '../Controllers/screeningFormController.js'

const router = express.Router();

//Login routes
router.post('/createLogin', createLogin);
router.post('/userLogin', userLogin);
router.get('/allLogin', getAllLogins);
router.delete('/deleteLogin/:id', deleteLogin);
router.get('/loginId/:id', getLoginById);

// Enrollment Form Routes
router.post('/createEnrollment', newEnrollmentForm);
router.get('/getEnrollment', getAllEnrollmentForms);
router.get("/getOneEnrollment/:id", getOneEnrollmentForm);
router.delete("/deleteOne/:id", deleteEnrollmentForm);

// Delivery Form Routes
router.post('/createDelivery', createDeliveryForm);
router.get('/getDelivery', getdeliveryForms);
router.get('/getoneDelivery/:id', getOneDeliveryForm);
router.delete('/deleteDelivery/:id', deleteOneDeliveryForm);

//Screening Routes
router.get('/getScreeninForms', getAllSreeningForms);
router.post('/createScreeningForm', createScreeningForm);
router.get('/getOneScreeningForm/:id', getOneScreeningForm);
router.delete('/deleteScreeningForm/:id', deleteScreeningForm);

export default router;