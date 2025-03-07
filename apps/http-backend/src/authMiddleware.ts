import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import {JWT_SECRET} from '@repo/common/config'

// ✅ Correctly Extend Express's Request Type
declare module "express" {
    interface Request {
        userId?: string; // ✅ Mark it optional to prevent errors
    }
}

export function authMiddleware (req: Request, res: Response, next: NextFunction):any {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Not authorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token as string, JWT_SECRET) as JwtPayload;

        // ✅ Ensure `userId` exists in `decoded`
        if (!decoded || typeof decoded !== "object" || !decoded.userId) {
            return res.status(401).json({ message: "Not authorized" });
        }

        req.userId = decoded.userId; // ✅ Now TypeScript should recognize it
        next();
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}
