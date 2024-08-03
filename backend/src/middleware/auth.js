import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");

        if (!token) return res.status(403).json({ message: 'Access denied' });

        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        const verifyTokenResponse = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verifyTokenResponse;
        next();
    
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}