import CategoryController from '@controllers/category.controller';
import CategorySchema from '@validations/category.schema';
import zodAsyncValidation from 'middlewares/zodAsyncValidation';
import { Router } from 'express';

const router: Router = Router();
const categoryController = new CategoryController();

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post( '/',zodAsyncValidation(CategorySchema),categoryController.createCategory);
router.patch('/:id',zodAsyncValidation(CategorySchema),categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;
