import express from 'express';
import {newEnrollmentForm, getAllEnrollmentForms, getOneEnrollmentForm, deleteEnrollmentForm} from '../Controllers/enrollmentFormController.js';
import {createDeliveryForm, getdeliveryForms, getOneDeliveryForm, deleteOneDeliveryForm} from '../Controllers/deliveryFormController.js'

const route = express.Router();

// Enrollment Form Routes
route.post('/createNew', newEnrollmentForm);
route.get('/getenrolls', getAllEnrollmentForms);
route.get("/getOne/:id", getOneEnrollmentForm);
route.delete("/deleteOne/:id", deleteEnrollmentForm);

// Delivery Form Routes
route.post('/createdelivery', createDeliveryForm);
route.get('/getdelivery', getdeliveryForms);
route.get('/getonedelivery', getOneDeliveryForm);
route.delete('/deletedelivery', deleteOneDeliveryForm);

//Screening Routes


export default route;