import express from 'express';
import * as AuthController from '../controllers/AuthController'
import { validateBody } from '../middlewares';
import { loginRegisterSchema } from '../schemas/authSchema';

const router = express.Router();

router.post('/register', validateBody(loginRegisterSchema), AuthController.register)
router.post('/login', validateBody(loginRegisterSchema), AuthController.login)

export default router