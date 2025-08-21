import zodAsyncValidation from 'middlewares/zodAsyncValidation';
import ItemController from '@controllers/item.controller';
import { ItemSchema, ItemUpdateSchema } from '@validations/item.schema';
import { Router } from 'express';

const router: Router = Router();
const itemController = new ItemController();

router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItemById);
router.post('/', zodAsyncValidation(ItemSchema), itemController.createItem);
router.patch('/:id', zodAsyncValidation(ItemUpdateSchema), itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

export default router;
