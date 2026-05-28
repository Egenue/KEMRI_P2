import express from 'express';
import { createLogin, getAllLogins, getLoginById, deleteLogin, userLogin } from '../Controllers/loginController.js';
import { newEnrollmentForm, getAllEnrollmentForms, getOneEnrollmentForm, updateEnrollmentForm, deleteEnrollmentForm } from '../Controllers/enrollmentFormController.js';
import { createDeliveryForm, getdeliveryForms, getOneDeliveryForm, updateDeliveryForm, deleteOneDeliveryForm } from '../Controllers/deliveryFormController.js';
import { createScreeningForm, getAllSreeningForms, getOneScreeningForm, updateScreeningForm, deleteScreeningForm } from '../Controllers/screeningFormController.js';
import { createCloseoutForm, getAllCloseoutForms, getOneCloseoutForm, updateCloseoutForm, deleteCloseoutForm } from '../Controllers/closeoutFormController.js';
import { createGestAge, getAllGestAge, getOneGestAge, updateGestAge, deleteGestAge } from '../Controllers/gestationAge.js';

const router = express.Router();

// Login routes
router.post('/createLogin', createLogin);
router.post('/userLogin', userLogin);
router.get('/allLogin', getAllLogins);
router.delete('/deleteLogin/:id', deleteLogin);
router.get('/loginId/:id', getLoginById);

// Enrollment Form Routes
router.post('/createEnrollment', newEnrollmentForm);
router.get('/getEnrollment', getAllEnrollmentForms);
router.get("/getOneEnrollment/:id", getOneEnrollmentForm);
router.put("/updateEnrollment/:id", updateEnrollmentForm);
router.delete("/deleteOne/:id", deleteEnrollmentForm);

// Delivery Form Routes
router.post('/createDelivery', createDeliveryForm);
router.get('/getDelivery', getdeliveryForms);
router.get('/getoneDelivery/:id', getOneDeliveryForm);
router.put('/updateDelivery/:id', updateDeliveryForm);
router.delete('/deleteDelivery/:id', deleteOneDeliveryForm);

// Screening Routes
router.post('/createScreeningForm', createScreeningForm);
router.get('/getScreeninForms', getAllSreeningForms);
router.get('/getOneScreeningForm/:id', getOneScreeningForm);
router.put('/updateScreeningForm/:id', updateScreeningForm);
router.delete('/deleteScreeningForm/:id', deleteScreeningForm);

// Closeout Routes
router.post('/createCloseout', createCloseoutForm);
router.get('/getCloseout', getAllCloseoutForms);
router.get('/getOneCloseout/:id', getOneCloseoutForm);
router.put('/updateCloseout/:id', updateCloseoutForm);
router.delete('/deleteCloseout/:id', deleteCloseoutForm);

// Gestation Age Routes
router.post('/createGestAge', createGestAge);
router.get('/getGestAge', getAllGestAge);
router.get('/getOneGestAge/:screeningId', getOneGestAge);
router.put('/updateGestAge/:screeningId', updateGestAge);
router.delete('/deleteGestAge/:screeningId', deleteGestAge);

export default router;
