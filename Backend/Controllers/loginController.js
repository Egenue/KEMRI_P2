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
            let nameParts = fullName.trim().split(/\s+/);
            function nameInitials(nameParts) {
                let initials = ""; 
                for (let i = 0; i < nameParts.length; i++) { 
                    const currentName = nameParts[i].toUpperCase();
                    initials += currentName[0]; 
                }
                return initials;
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const dateCreate = await new Date();
            const newLogin = new login({
                fullName: fullName,
                email: email,
                userName: userName,
                password: hashedPassword,
                dateCreated: dateCreate,
                userRole: userRole,
                userInitials: userInitials ?? nameInitials(nameParts)
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
        const { email, userName, fullName, password, dateLoggedIn, userInitials } = req.body;
        
        let user = await login.findOne({ email });
        if (!user) {
            user = await login.findOne({ userName });
        }
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        let nameParts = fullName.trim().split(/\s+/);
        function nameInitials(nameParts) {
            let initials = ""; 
            for (let i = 0; i < nameParts.length; i++) { 
                const currentName = nameParts[i].toUpperCase();
                initials += currentName[0]; 
            }
            return initials;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        } else {
            user.dateLoggedIn = new Date();
            if (fullName) {
                user.fullName = fullName;
            }
            if(!userInitials){
            user.userInitials = nameInitials(nameParts)
            }
            await user.save();
            res.status(200).json({ 
                message: 'Login successful', 
                user: {
                    email: user.email,
                    userName: user.userName,
                    fullName: user.fullName,
                    userRole: user.userRole,
                    dateLoggedIn: user.dateLoggedIn,
                    userInitials: user.userInitials ?? nameInitials(nameParts)
                },
                dateLoggedIn: user.dateLoggedIn.toDateString()
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createLogin, getAllLogins, getLoginById, deleteLogin, userLogin };