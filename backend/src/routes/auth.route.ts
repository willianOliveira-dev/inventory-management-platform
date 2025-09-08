import AuthController from '@controllers/auth.controller';
import zodAsyncValidation from 'middlewares/zodAsyncValidation';
import AuthSchema from '@validations/auth.schema';
import { Router } from 'express';
import { UserSchema } from '@validations/user.schema';
import authMiddleware from 'middlewares/auth.middleware';

const authController: AuthController = new AuthController();
const router: Router = Router();

router.post('/login', zodAsyncValidation(AuthSchema), authController.login);
router.post('/register',zodAsyncValidation(UserSchema), authController.register);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware, authController.getMe)

export default router;
