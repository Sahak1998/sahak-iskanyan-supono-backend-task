import { Request, Response, NextFunction } from 'express';
import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from '../firebase/config';

export const register = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        const user = userCredential.user;

        res.status(201).json({
            message: "User registered successfully",
            uid: user.uid,
            email: user.email,
            token: await user.getIdToken(),
        });
        return
    } catch (error: unknown) {
        if (error instanceof FirebaseError) {
            if (error.code === 'auth/email-already-in-use') {
                return res.status(400).json({ message: 'Email is already in use.' });
                
            } else if (error.code === 'auth/weak-password') {
                res.status(400).json({ message: 'Password is too weak.' });
                return
            }
        }

        res.status(500).json({ message: 'An error occurred during registration.', error: (error as Error).message });
        return
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { email, password } = req.body;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        return res.status(200).json({
            message: 'Login successful',
            uid: user.uid,
            email: user.email,
            token: await user.getIdToken(),
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            if (error.message.includes('user-not-found')) {
                return res.status(400).json({ message: 'No user found with this email.' });
            } else if (error.message.includes('wrong-password')) {
                return res.status(400).json({ message: 'Incorrect password.' });
            } else {
                return res.status(500).json({ message: 'An error occurred during login.', error: error.message });
            }
        }

        return res.status(500).json({ message: 'An unknown error occurred during login.' });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        await signOut(auth);

        return res.status(200).json({
            message: 'User logged out successfully.',
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({
                message: 'An error occurred during logout.',
                error: error.message,
            });
        }

        return res.status(500).json({
            message: 'An unknown error occurred during logout.',
        });
    }
};