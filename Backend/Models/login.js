import mongoose from 'mongoose';
const login = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    userInitials:{
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    userRole: {
        type: String,
        enum: ['Data Manager', 'Field Technician', 'Admin'],
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dateLoggedIn: {
        type: Date,
        default: Date.now
    },
    dateCreated: {
        type: Date
    }
})
export default mongoose.model('Login', login);