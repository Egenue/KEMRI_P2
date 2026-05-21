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