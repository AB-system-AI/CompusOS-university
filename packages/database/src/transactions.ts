import { type DatabaseConnection, type DatabaseTransaction } from './contracts.js';
import { TransactionError } from './errors.js';

export async function runInTransaction<T>(
  connection: DatabaseConnection,
  callback: (transaction: DatabaseTransaction) => Promise<T>,
): Promise<T> {
  const transaction = await connection.beginTransaction();
  try {
    const result = await callback(transaction);
    await transaction.commit();
    return result;
  } catch (error) {
    if (transaction.active) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        throw new TransactionError('Transaction rollback failed', rollbackError);
      }
    }
    throw error;
  }
}
