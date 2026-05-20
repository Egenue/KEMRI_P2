import express from 'express';
import { createLogin, getAllLogins, getLoginById, deleteLogin, userLogin } from '../Controllers/loginController.js';

const router = express.Router();

router.post('/create', createLogin);
router.post('/login', userLogin);
router.get('/all', getAllLogins);
router.delete('/delete/:id', deleteLogin);
router.get('/:id', getLoginById);


export default router;