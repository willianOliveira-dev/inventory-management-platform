import pool from '@config/connect';
import NotFoundError from '@utils/errors/NotFoundError';
import type { Entities, TableName, User } from '../types/index';
import type { ResultSetHeader } from 'mysql2';

type Tables = User;

export default abstract class BaseModel {
    protected static errorHandler(error: unknown): never {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(String(error));
    }

    private static _ensureTableExist(table: TableName): void {
        if (!BaseModel._tableIdMap[table]) {
            throw new Error(`Invalid or unmapped table: ${table}`);
        }
    }

    private static _tableExist(table: TableName): void {
        BaseModel._ensureTableExist(table);
    }

    private static _columnIdExist(table: TableName) {
        BaseModel._ensureTableExist(table);
        return BaseModel._tableIdMap[table];
    }

    private static _tableIdMap: Entities = {
        users: 'user_id',
        items: 'item_id',
        categories: 'category_id',
        stockHistory: 'history_id',
    };

    public async getAll(
        table: TableName,
        columnsArray: string[]
    ): Promise<Tables[]> {
        try {
            BaseModel._tableExist(table);
            const columns: string = columnsArray.join(', ');
            const sql = `SELECT ${columns} FROM ${table};`;
            const [resultSelect] = await pool.query<Tables[]>(sql);

            if (resultSelect.length === 0) return [];

            return resultSelect;
        } catch (error) {
            BaseModel.errorHandler(error);
        }
    }

    public async getById(
        table: TableName,
        columnsArray: string[],
        id: string
    ): Promise<Tables[]> {
        try {
            const columnId: string = BaseModel._columnIdExist(table);
            const columns: string = columnsArray.join(', ');

            const sql = `SELECT ${columns} FROM ${table} WHERE ${columnId} = ?;`;
            const [resultSelect] = await pool.query<Tables[]>(sql, [id]);

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

    public async create(
        table: TableName,
        columnsArray: string[],
        valuesArray: string[]
    ): Promise<Tables[]> {
        const conn = await pool.getConnection();
        try {
            const columnId = BaseModel._columnIdExist(table);
            const columns: string = columnsArray.join(', ');
            const placeholders = valuesArray.map((value) => '?').join(', ');
            const sqlInsert: string = `INSERT INTO ${table} (${columns}) VALUES (${placeholders});`;
            const sqlSelect: string = `SELECT * FROM ${table} WHERE ${columnId} = ?;`;

            await conn.query('BEGIN;');

            const [queryInsert] = await conn.query<ResultSetHeader>(
                sqlInsert,
                valuesArray
            );
            const [resultSelect] = await conn.query<Tables[]>(sqlSelect, [
                queryInsert.insertId,
            ]);

            await conn.query('COMMIT;');

            return resultSelect;
        } catch (error) {
            await conn.query('ROLLBACK;');
            BaseModel.errorHandler(error);
        } finally {
            conn.release();
        }
    }

    public async update(
        table: TableName,
        columnsArray: string[],
        valuesArray: string[],
        id: string
    ): Promise<Tables[]> {
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

            if (queryUpdate.affectedRows === 0) {
                throw new NotFoundError(
                    `Record with ID ${id} not found in table ${table}`
                );
            }

            const [resultSelect] = await conn.query<Tables[]>(sqlSelect, [id]);

            await conn.query('COMMIT;');

            return resultSelect;
        } catch (error) {
            await conn.query('ROLLBACK;');
            BaseModel.errorHandler(error);
        } finally {
            conn.release();
        }
    }

    public async delete(table: TableName, id: string): Promise<void> {
        const conn = await pool.getConnection();
        try {
            const columnId = BaseModel._columnIdExist(table);
            const sqlSelect = `SELECT * FROM ${table} WHERE ${columnId} = ?;`;
            const [resultSelect] = await conn.query<Tables[]>(sqlSelect, [id]);
            if (resultSelect.length === 0) {
                throw new NotFoundError(
                    `Record with ID ${id} not found in table ${table}`
                );
            }
            const sqlDelete = `DELETE FROM ${table} WHERE ${columnId} = ?;`;
            await conn.query('BEGIN;');
            await conn.query<Tables[]>(sqlDelete, [id]);
            await conn.query('COMMIT;');
        } catch (error) {
            await conn.query('ROLLBACK;');
            BaseModel.errorHandler(error);
        } finally {
            conn.release();
        }
    }
}
