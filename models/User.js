import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true, 
        unique: true,
    },
    email: {
        type: String, 
        required: true, 
        unique: true,
    },
    passwordHash: {
        type: String, 
        required: true,
    },
    comments: {
        type: [mongoose.Types.ObjectId],
        ref: 'Comment',
        default: []
    },
    avatarUrl: String, 
}, {
    timestamps: true,
})

export default mongoose.model('User', UserSchema)