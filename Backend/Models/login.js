import mongoose from 'mongoose';
const login = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    userName: {
        type: String,
        required: true,
        unique: true
    },
    userInitials:{
        type: String,
        required: false
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
        type: Date
    },

    dateCreated: {
        type: Date
    }
})
export default mongoose.model('Login', login);