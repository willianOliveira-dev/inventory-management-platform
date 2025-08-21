import BaseModel from '@models/BaseModel';

const baseModel = new BaseModel();

/**
 * StockHistoryModel provides CRUD operations for the 'stock_history' table using BaseModel.
 */
export default class StockHistoryModel {
    public async getAllStockHistory() {
        /**
         * Asynchronously retrieves all stock history records from the 'stock_history' table.
         * @returns A Promise that resolves to an array of stock history records.
         */
        return await baseModel.getAll('stock_history', [
            'history_id',
            'item_id',
            'user_id',
            'old_price_cents',
            'new_price_cents',
            'old_quantity',
            'new_quantity',
            'operation',
            'created_at',
        ]);
    }

    public async getStockHistoryById(stockHistoryId: string) {
        /**
         * Asynchronously retrieves a stock history record by its ID.
         * @param stockHistoryId The ID of the stock history record to retrieve.
         * @returns A Promise that resolves to an array containing the matching record.
         */
        return await baseModel.getById(
            'stock_history',
            [
                'history_id',
                'item_id',
                'user_id',
                'old_price_cents',
                'new_price_cents',
                'old_quantity',
                'new_quantity',
                'operation',
                'created_at',
            ],
            stockHistoryId
        );
    }

    public async createStockHistory<V>(stockHistoryValuesArray: V[]) {
        /**
         * Asynchronously creates a new stock history record in the 'stock_history' table.
         * @typeParam V The type of the values being inserted.
         * @param stockHistoryValuesArray An array of values corresponding to the stock history fields.
         * @returns A Promise that resolves to an array of the newly created records.
         */
        return await baseModel.create(
            'stock_history',
            [
                'history_id',
                'item_id',
                'user_id',
                'old_price_cents',
                'new_price_cents',
                'old_quantity',
                'new_quantity',
                'operation',
                'created_at',
            ],
            stockHistoryValuesArray
        );
    }
}
