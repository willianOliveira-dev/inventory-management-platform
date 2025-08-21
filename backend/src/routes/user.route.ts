import UserController from '@controllers/user.controller';
import zodAsyncValidation from 'middlewares/zodAsyncValidation';
import { Router } from 'express';
import  {UserSchema, UserUpdateSchema}  from '@validations/user.schema';

const router: Router = Router();
const userController = new UserController();

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', zodAsyncValidation(UserSchema), userController.createUser);
router.patch('/:id', zodAsyncValidation(UserUpdateSchema), userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
