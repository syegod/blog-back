import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    text: {
        type: String, 
        required: true,
    },
    post: {
        type: mongoose.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Types.ObjectId, 
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
})

export default mongoose.model('Comment', CommentSchema)