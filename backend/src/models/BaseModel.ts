import pool from '@config/connect';
import NotFoundError from '@utils/errors/NotFoundError';
import type { Entities, TableName } from 'types';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

/**
 * The BaseModel class serves as the basis for CRUD operations on the 'users', 'items', 'categories' and 'stock_history' tables.
 */
export default class BaseModel {
    
    private static _tableIdMap: Entities = {
        users: 'user_id',
        items: 'item_id',
        categories: 'category_id',
        stock_history: 'history_id',
    };

    protected static errorHandler(error: unknown): never {
        /**
         * Handles and rethrows errors in a consistent format.
         * @param error The error to handle.
         * @throws Always throws an Error instance.
         */
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(String(error));
    }

    private static _ensureTableExist(table: TableName): void {
        /**
         * Validates whether the given table name exists in the internal table map.
         * @param table The name of the table to validate.
         * @throws Throws an error if the table is invalid or not mapped.
         */
        if (!BaseModel._tableIdMap[table]) {
            throw new Error(`Invalid or unmapped table: ${table}`);
        }
    }

    private static _tableExist(table: TableName): void {
        /**
         * Checks if the table exists by delegating to the internal validation method.
         * @param table The name of the table to check.
         * @throws Throws an error if the table is invalid or not mapped.
         */
        BaseModel._ensureTableExist(table);
    }

    private static _columnIdExist(table: TableName): string {
        /**
         * Retrieves the ID column name for the specified table.
         * @param table The name of the table.
         * @returns The name of the ID column for the table.
         * @throws Throws an error if the table is invalid or not mapped.
         */
        BaseModel._ensureTableExist(table);
        return BaseModel._tableIdMap[table];
    }

    public async getAll<T extends RowDataPacket>(
        table: TableName,
        columnsArray: string[]
    ): Promise<T[]> {
        /**
         * Asynchronously retrieves all records from the specified table with the given columns.
         * @param table The name of the table to query.
         * @param columnsArray An array of column names to select.
         * @returns A Promise that resolves to an array of records of type T.
         * @throws Throws an error if the database query fails.
         */
        try {
            BaseModel._tableExist(table);
            const columns: string = columnsArray.join(', ');
            const sql = `SELECT ${columns} FROM ${table};`;
            const [resultSelect] = await pool.query<T[]>(sql);

            if (resultSelect.length === 0) return [];

            return resultSelect;
        } catch (error) {
            BaseModel.errorHandler(error);
        }
    }

    public async getById<T extends RowDataPacket>(
        table: TableName,
        columnsArray: string[],
        id: string
    ): Promise<T[]> {
        /**
         * Asynchronously retrieves records from the specified table by ID with the given columns.
         * @param table The name of the table to query.
         * @param columnsArray An array of column names to select.
         * @param id The ID of the record to retrieve.
         * @returns A Promise that resolves to an array of records of type T.
         * @throws Throws a NotFoundError if no record is found, or another error if the query fails.
         */
        try {
            const columnId: string = BaseModel._columnIdExist(table);
            const columns: string = columnsArray.join(', ');

            const sql = `SELECT ${columns} FROM ${table} WHERE ${columnId} = ?;`;
            const [resultSelect] = await pool.query<T[]>(sql, [id]);

            if (resultSelect.length === 0) {
                throw new NotFoundError(
                    `Record with ID ${id} not found in table ${table}`
                );
            }

            return resultSelect;
        } catch (error) {
            BaseModel.errorHandler(error);
        }
    }

    public async create<T extends RowDataPacket, V>(
        table: TableName,
        columnsArray: string[],
        valuesArray: V[]
    ): Promise<T[]> {
        /**
         * Asynchronously inserts a new record into the specified table using the provided values.
         * @param table The name of the table to insert into.
         * @param columnsArray An array of column names to insert.
         * @param valuesArray An array of values corresponding to the columns.
         * @returns A Promise that resolves to an array of newly created records of type T.
         * @throws Throws an error if the database query fails.
         */
        const conn = await pool.getConnection();
        try {
            const columnId = BaseModel._columnIdExist(table);
            const columns: string = columnsArray.join(', ');
            const placeholders = valuesArray.map((value) => '?').join(', ');
            const sqlInsert: string = `INSERT INTO ${table} (${columns}) VALUES (${placeholders});`;
            const sqlSelect: string = `SELECT * FROM ${table} WHERE ${columnId} = ?;`;

            await conn.query('BEGIN;');

            await conn.query<ResultSetHeader>(sqlInsert, valuesArray);

            const idValue = valuesArray[0];

            const [resultSelect] = await conn.query<T[]>(sqlSelect, [idValue]);

            await conn.query('COMMIT;');

            return resultSelect;
        } catch (error) {
            await conn.query('ROLLBACK;');
            BaseModel.errorHandler(error);
        } finally {
            conn.release();
        }
    }

    public async update<T extends RowDataPacket, V>(
        table: TableName,
        columnsArray: string[],
        valuesArray: V[],
        id: string
    ): Promise<T[]> {
        /**
         * Asynchronously updates an existing record in the specified table using the provided ID and values.
         * @param table The name of the table to update.
         * @param columnsArray An array of column names to update.
         * @param valuesArray An array of new values corresponding to the columns.
         * @param id The ID of the record to update.
         * @returns A Promise that resolves to an array of updated records of type T.
         * @throws Throws a NotFoundError if no record is found, or another error if the query fails.
         */
        const conn = await pool.getConnection();
        try {
            const columnId: string = BaseModel._columnIdExist(table);
            const setClause: string[] = columnsArray.map(
                (column) => `${column} = ?`
            );
            const sqlUpdate = `UPDATE ${table} SET ${setClause.join(
                ', '
            )} WHERE ${columnId} = ?;`;

            const sqlSelect = `SELECT * FROM ${table} WHERE ${columnId} = ?;`;

            await conn.query('BEGIN;');

            const [queryUpdate] = await conn.query<ResultSetHeader>(sqlUpdate, [
                ...valuesArray,
                id,
            ]);
            console.log(valuesArray, id)
            if (queryUpdate.affectedRows === 0) {
                throw new NotFoundError(
                    `Record with ID ${id} not found in table ${table}`
                );
            }

            const [resultSelect] = await conn.query<T[]>(sqlSelect, [id]);

            await conn.query('COMMIT;');

            return resultSelect;
        } catch (error) {
            await conn.query('ROLLBACK;');
            BaseModel.errorHandler(error);
        } finally {
            conn.release();
        }
    }

    public async delete<T extends RowDataPacket>(
        table: TableName,
        id: string
    ): Promise<void> {
        /**
         * Asynchronously deletes a record from the specified table using the provided ID.
         * @param table The name of the table to delete from.
         * @param id The ID of the record to delete.
         * @returns A Promise that resolves with no value upon successful deletion.
         * @throws Throws a NotFoundError if no record is found, or another error if the query fails.
         */
        const conn = await pool.getConnection();
        try {
            const columnId = BaseModel._columnIdExist(table);
            const sqlSelect = `SELECT * FROM ${table} WHERE ${columnId} = ?;`;
            const [resultSelect] = await conn.query<T[]>(sqlSelect, [id]);
            if (resultSelect.length === 0) {
                throw new NotFoundError(
                    `Record with ID ${id} not found in table ${table}`
                );
            }
            const sqlDelete = `DELETE FROM ${table} WHERE ${columnId} = ?;`;
            await conn.query('BEGIN;');
            await conn.query<T[]>(sqlDelete, [id]);
            await conn.query('COMMIT;');
        } catch (error) {
            await conn.query('ROLLBACK;');
            BaseModel.errorHandler(error);
        } finally {
            conn.release();
        }
    }
}
