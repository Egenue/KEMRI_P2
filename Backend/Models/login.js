import mongoose from 'mongoose';
const login = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    userInitials:{
        type: String,
        default: function() {
            const name = this.fullName || this.userName || 'XX';
            const parts = name.trim().split(/\s+/).filter(Boolean);
            if (parts.length >= 2) {
                return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
            }
            return name.length >= 2 ? name.substring(0, 2).toUpperCase() : name.toUpperCase();
        }
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        default: function() {
            return this.userName || 'Unknown User';
        }
    },
    userRole: {
        type: String,
        enum: ['Data Manager', 'Field Technician', 'Admin'],
        default: 'Field Technician'
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