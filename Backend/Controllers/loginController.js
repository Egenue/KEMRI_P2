import login from '../Models/login.js';
import bcrypt from 'bcryptjs';

const createLogin = async (req, res) => {
    try {
        const { email, userName, password, dateCreated, userRole } = req.body;

        const exists = await login.findOne({
            $or:[{email: req.body.email},{userName: req.body.userName}]
        });
        const validPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&#])[A-Za-z\d@$!%?&#]{8,}$/;
        if (!validPass.test(password)){
            return res.status(400).json({"message":"Password does not meet requirement"});
        }else if (exists){
            return res.status(401).json({"message":"User already exists"});
        }else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const dateCreate = await new Date();
            const newLogin = new login({
                email,
                userName,
                password: hashedPassword,
                dateCreated: dateCreate,
                userRole
            });
            await newLogin.save();
            res.status(201).json(newLogin);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllLogins = async (req, res) => {
    try {
        const logins = await login.find();
        res.status(200).json(logins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteLogin = async (req, res) => {
    try {
        const loginId = req.params.id;
        const deletedLogin = await login.findByIdAndDelete(loginId);
        if (!deletedLogin) {
            return res.status(404).json({ message: 'Login not found' });
        }
        res.status(200).json({ message: 'Login deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }  
};

const getLoginById = async (req, res) => {
    try {
        const loginId = req.params.id;
        const loginData = await login.findById(loginId);
        if (!loginData) {
            return res.status(404).json({ message: 'Login not found' });
        }
        res.status(200).json(loginData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const userLogin = async (req, res) => {
    try {
        const { email, password, dateLoggedIn } = req.body;
        const user = await login.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }else{
            user.dateLoggedIn = dateLoggedIn;
            await user.save();
            res.status(200).json({ message: 'Login successful', user, dateLoggedIn: dateLoggedIn.toDateString()});
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createLogin, getAllLogins, getLoginById, deleteLogin, userLogin };