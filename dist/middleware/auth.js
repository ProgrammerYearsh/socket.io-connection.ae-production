import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js'; // ✅ Now using `import` instead of `require`
export const socketAuth = async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token)
        return next(new Error('No token provided'));
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
            },
        });
        if (!user)
            return next(new Error('User not found'));
        socket.user = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
        };
        next();
    }
    catch (err) {
        next(new Error('Unauthorized'));
    }
};
