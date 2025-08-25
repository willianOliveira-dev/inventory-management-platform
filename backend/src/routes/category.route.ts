import CategoryController from '@controllers/category.controller';
import authMiddleware from 'middlewares/auth.middleware';
import CategorySchema from '@validations/category.schema';
import zodAsyncValidation from 'middlewares/zodAsyncValidation';
import { Router } from 'express';

const router: Router = Router();
const categoryController = new CategoryController();

router.get('/', authMiddleware ,categoryController.getAllCategories);
router.get('/:id', authMiddleware, categoryController.getCategoryById);
router.post( '/', authMiddleware, zodAsyncValidation(CategorySchema),categoryController.createCategory);
router.patch('/:id', authMiddleware, zodAsyncValidation(CategorySchema),categoryController.updateCategory);
router.delete('/:id',authMiddleware, categoryController.deleteCategory);

export default router;
