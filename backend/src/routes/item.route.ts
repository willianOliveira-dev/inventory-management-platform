import zodAsyncValidation from 'middlewares/zodAsyncValidation';
import authMiddleware from 'middlewares/auth.middleware';
import ItemController from '@controllers/item.controller';
import { ItemSchema, ItemUpdateSchema } from '@validations/item.schema';
import { Router } from 'express';

const router: Router = Router();
const itemController = new ItemController();

router.get('/', authMiddleware, itemController.getAllItems);
router.get('/:id', authMiddleware, itemController.getItemById);
router.get('/user/my-items', authMiddleware,itemController.getItemsByUserId);
router.post('/',authMiddleware, zodAsyncValidation(ItemSchema), itemController.createItem);
router.patch('/:id', authMiddleware,zodAsyncValidation(ItemUpdateSchema), itemController.updateItem);
router.delete('/:id', authMiddleware,itemController.deleteItem);

export default router;
