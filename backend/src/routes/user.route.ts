import UserController from '@controllers/user.controller';
import authMiddleware from 'middlewares/auth.middleware';
import zodAsyncValidation from 'middlewares/zodAsyncValidation';
import { Router } from 'express';
import  {UserSchema, UserUpdateSchema}  from '@validations/user.schema';

const router: Router = Router();
const userController = new UserController();

router.get('/', authMiddleware,userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.post('/', authMiddleware, zodAsyncValidation(UserSchema), userController.createUser);
router.patch('/:id', authMiddleware, zodAsyncValidation(UserUpdateSchema), userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

export default router;
