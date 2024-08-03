import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 2,
        max: 50
    },
    lastName: {
        type: String,
        required: true,
        min: 2,
        max: 50
    } ,
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },
    picturePath: {
        type: String,
        default: ''
    },
    friends: {
        type: Array,
        default: []
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
}, {timestamps: true})

const User = mongoose.model('User', UserSchema);

export default User;