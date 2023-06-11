import PostModel from "../models/Post.js";
import CommentModel from '../models/Comment.js';
import UserModel from '../models/User.js';

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find({}).populate('user', '-passwordHash').exec();
        res.json(posts);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Cannot get all posts.' });
    }
};

export const getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await PostModel.findByIdAndUpdate({
            _id: id
        }, {
            $inc: { viewsCount: 1 }
        }, {
            new: true
        }).populate('user', '-passwordHash').populate({ path: 'comments', options: { sort: { createdAt: -1 } }, populate: { path: 'user', select: '-passwordHash' } });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post)
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Cannot get post.' });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });
        const post = await doc.save();
        return res.json(post);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Post creation failed.' });
    }
};

export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await PostModel.findByIdAndRemove({ _id: id });
        if (!post)
            return res.status(404).json({ message: 'Post not found.' });
        return res.json({ success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Cannot remove post.' });
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await PostModel.updateOne({ _id: id },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId,
            });
        if (!post)
            return res.status(404).json({ message: 'Post not found.' });
        return res.json({ success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Cannot update post.' });
    }
};

export const comment = async (req, res) => {
    try {
        const { id } = req.params;
        const newComment = new CommentModel({
            text: req.body.comment,
            user: req.userId,
            post: id
        });
        await newComment.save();

        const post = await PostModel.findOneAndUpdate({ _id: id },
            { $push: { comments: newComment } },
            { new: true })
            .populate('user', '-passwordHash').populate({ path: 'comments', options: { sort: { createdAt: -1 } }, populate: { path: 'user', select: '-passwordHash' } });
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        return res.status(201).json(post);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Cannot create comment.' });
    }
};

export const removecomment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await CommentModel.findByIdAndRemove(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found.' })
        }
        const post = await PostModel.findOneAndUpdate({ _id: comment?.post },
            {
                $pull: { comments: id }
            },
            { new: true })
            .populate({ path: 'comments', options: { sort: { createdAt: -1 } }, populate: { path: 'user', select: '-passwordHash' } });
        return res.json(post);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Cannot remove comment.' });
    }
};