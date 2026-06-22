import login from '../Models/login.js';
import bcrypt from 'bcryptjs';

const createLogin = async (req, res) => {
    try {
        const {fullName, email, userName, password, dateCreated, userRole, userInitials } = req.body;

        const exists = await login.findOne({
            $or:[{email: req.body.email},{userName: req.body.userName},{fullName: req.body.fullName}]
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
                fullName,
                email,
                userName,
                password: hashedPassword,
                dateCreated: dateCreate,
                userRole,
                userInitials
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
        else
        {
            res.status(200).json(loginData);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const userLogin = async (req, res) => {
    try {
        // 1. Properly extract the user input fields from the request body
        const { email, userName, password } = req.body;
        
        // 2. Locate the user document in the database
        let user = await login.findOne({ email: email });
        if (!user && userName) {
            user = await login.findOne({ userName: userName });
        }
        
        // Return early if no account matches
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // 3. FIX BCRYPT: Check plain-text password against the database hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // 4. Update the actual Mongoose document instance, not req.body
        user.dateLoggedIn = new Date(); 
        await user.save(); // This safely updates your database document
        
        // 5. Send back the clean user profile info to Blazor
        res.status(200).json({ 
            message: 'Login successful', 
            user: {
                email: user.email,
                userName: user.userName,
                fullName: user.fullName,
                userRole: user.userRole,
                dateLoggedIn: user.dateLoggedIn,
                userInitials: user.userInitials
            },
            dateLoggedIn: user.dateLoggedIn.toDateString()
        });

    } catch (error) {
        console.error("Login Error Handler:", error); // Keeps visibility in backend logs
        res.status(500).json({ message: error.message });
    }
};

export { createLogin, getAllLogins, getLoginById, deleteLogin, userLogin };