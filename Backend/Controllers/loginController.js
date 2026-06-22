import login from '../Models/login.js';
import bcrypt from 'bcryptjs';

const createLogin = async (req, res) => {
    try {
        const {fullName, email, userName, password, dateCreated, userRole, userInitials } = req.body;

        const queryOr = [];
        if (email) queryOr.push({ email });
        if (userName) queryOr.push({ userName });
        if (fullName) queryOr.push({ fullName });

        const exists = queryOr.length > 0 ? await login.findOne({ $or: queryOr }) : null;
        const validPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&#])[A-Za-z\d@$!%?&#]{8,}$/;
        if (!validPass.test(password)){
            return res.status(400).json({"message":"Password does not meet requirement"});
        }else if (exists){
            return res.status(401).json({"message":"User already exists"});
        }else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const dateCreate = new Date();
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
        const { email, userName, password, fullName } = req.body;
        
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

        // Populate missing fields for legacy/existing users to avoid validation issues
        if (!user.fullName) {
            user.fullName = fullName || user.userName || email.split('@')[0] || 'Unknown User';
        }
        if (!user.userRole) {
            user.userRole = 'Field Technician';
        }
        if (!user.userInitials) {
            const nameInput = user.fullName || user.userName || 'XX';
            const cleanName = nameInput.trim();
            const parts = cleanName.split(/\s+/).filter(Boolean);
            if (parts.length >= 2) {
                user.userInitials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
            } else {
                user.userInitials = cleanName.length >= 2 ? cleanName.substring(0, 2).toUpperCase() : cleanName.toUpperCase();
            }
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