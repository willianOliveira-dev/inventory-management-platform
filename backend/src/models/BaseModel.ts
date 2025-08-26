import pool from '@config/connect';
import NotFoundError from '@errors/http/NotFoundError';
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
        refresh_tokens: 'token_id',
        stock_history: 'history_id',
    };

    protected static errorHandler(error: unknown): never {
        /**
         * Handles and rethrows errors in a consistent format.
         * @param error The error to handle.
         * @throws Always throws an Error instance.
         */
        if (error instanceof NotFoundError) {
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

    public async hasRecord(
        table: TableName,
        column: string,
        value: string
    ): Promise<boolean> {
        /**
         * Checks whether a record exists in a given table by matching a column value (case-insensitive).
         * Uses a `LIKE` comparison with `LOWER()` to ensure case-insensitive matching.
         * Returns `true` if at least one record matches the condition, otherwise `false`.
         *
         * @param table - The name of the table to query.
         * @param column - The column to filter by.
         * @param value - The value to match against the specified column.
         * @returns A Promise that resolves to `true` if a matching record exists, or `false` otherwise.
         */
        const sqlSelect = `SELECT ${column} FROM ${table} WHERE LOWER(${column}) LIKE LOWER(?)`;
        const [resultSelect] = await pool.query<RowDataPacket[]>(
            sqlSelect,
            value
        );

        if (resultSelect.length > 0) {
            return true;
        }

        return false;
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

            return resultSelect;
        } catch (error) {
            BaseModel.errorHandler(error);
        }
    }

    public async getByField<T extends RowDataPacket, V>(
        table: TableName,
        columnsArray: string[],
        field: string,
        value: V
    ): Promise<T[]> {
        /**
         * Retrieves records from a database table where a specific field matches a given value (case-insensitive).
         *
         * Uses the `ILIKE` operator for pattern matching, which is typically supported in PostgreSQL.
         *
         * @typeParam T - The expected shape of the returned rows (must extend RowDataPacket).
         * @typeParam V - The type of the value used for filtering.
         * @param table - The name of the table to query.
         * @param columnsArray - An array of column names to select.
         * @param field - The column name to filter by.
         * @param value - The value to match against the specified field using `ILIKE`.
         * @returns A Promise that resolves to an array of matching records.
         */
        const columns: string = columnsArray.join(', ');
        const sqlSelect = `SELECT ${columns} FROM ${table} WHERE LOWER(${field}) LIKE LOWER(?)`;
        const [resultSelect] = await pool.query<T[]>(sqlSelect, [`%${value}%`]);

        return resultSelect;
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

            await conn.beginTransaction();

            await conn.query<ResultSetHeader>(sqlInsert, valuesArray);

            const idValue = valuesArray[0];

            const [resultSelect] = await conn.query<T[]>(sqlSelect, [idValue]);

            await conn.commit();

            return resultSelect;
        } catch (error) {
            await conn.rollback();
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

            await conn.beginTransaction();

            const [queryUpdate] = await conn.query<ResultSetHeader>(sqlUpdate, [
                ...valuesArray,
                id,
            ]);

            if (queryUpdate.affectedRows === 0) {
                throw new NotFoundError(
                    `Record with ID ${id} not found in table ${table}`
                );
            }

            const [resultSelect] = await conn.query<T[]>(sqlSelect, [id]);

            await conn.commit();

            return resultSelect;
        } catch (error) {
            await conn.rollback();
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
            const sqlSelect = `SELECT COUNT(*) AS count FROM ${table} WHERE ${columnId} = ?;`;

            await conn.beginTransaction();

            const [resultSelect] = await conn.query<RowDataPacket[]>(
                sqlSelect,
                [id]
            );

            if (resultSelect[0].count === 0) {
                throw new NotFoundError(
                    `Record with ID ${id} not found in table ${table}`
                );
            }

            const sqlDelete = `DELETE FROM ${table} WHERE ${columnId} = ?;`;

            await conn.query<T[]>(sqlDelete, [id]);
            await conn.commit();
        } catch (error) {
            await conn.rollback();
            BaseModel.errorHandler(error);
        } finally {
            conn.release();
        }
    }
}
