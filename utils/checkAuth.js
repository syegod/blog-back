import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s/, '');
    if(token){
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decodedToken._id;
            next();
        } catch (error) {
            console.log(error);
            return res.status(403).json({
                message: 'Not authenticated.'
            });
        }
    } else {
        return res.status(403).json({
            message: 'Not authenticated.'
        });
    }
}