const sql = require('mssql');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  server: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'fashionhub',
  port: parseInt(process.env.DB_PORT || 1433, 10),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  }
};

const poolPromise = new sql.ConnectionPool(config).connect()
  .then(pool => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('Database Connection Failed! Bad Config: ', err);
  });

function rewriteQueryForSqlSrv(queryString, params) {
  let paramIndex = 0;
  const newParams = {};

  const newQueryString = queryString.replace(/\?/g, () => {
    const pName = `p${paramIndex}`;
    newParams[pName] = params[paramIndex];
    paramIndex++;
    return `@${pName}`;
  });

  return { newQueryString, newParams };
}

const db = {
  async query(queryString, params = []) {
    const pool = await poolPromise;
    const request = pool.request();

    // Convert ? to @p0, @p1 etc.
    const { newQueryString, newParams } = rewriteQueryForSqlSrv(queryString, params);

    for (const [key, val] of Object.entries(newParams)) {
      request.input(key, val);
    }

    let finalQuery = newQueryString;
    const isInsert = /^\s*INSERT/i.test(finalQuery);
    if (isInsert && !finalQuery.includes('SCOPE_IDENTITY')) {
      finalQuery += '; SELECT SCOPE_IDENTITY() AS insertId;';
    }

    const result = await request.query(finalQuery);

    let rows = result.recordset || [];
    let extra = {};
    if (isInsert && result.recordsets?.length > 0) {
      const lastSet = result.recordsets[result.recordsets.length - 1];
      if (lastSet && lastSet.length > 0 && lastSet[0].insertId) {
        extra.insertId = lastSet[0].insertId;
      }
    }

    return [rows, extra];
  },

  async getConnection() {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    return {
      async query(queryString, params = []) {
        const request = transaction.request();

        const { newQueryString, newParams } = rewriteQueryForSqlSrv(queryString, params);

        for (const [key, val] of Object.entries(newParams)) {
          request.input(key, val);
        }

        let finalQuery = newQueryString;
        const isInsert = /^\s*INSERT/i.test(finalQuery);
        if (isInsert && !finalQuery.includes('SCOPE_IDENTITY')) {
          finalQuery += '; SELECT SCOPE_IDENTITY() AS insertId;';
        }

        const result = await request.query(finalQuery);

        let rows = result.recordset || [];
        let extra = {};
        if (isInsert && result.recordsets?.length > 0) {
          const lastSet = result.recordsets[result.recordsets.length - 1];
          if (lastSet && lastSet.length > 0 && lastSet[0].insertId) {
            extra.insertId = lastSet[0].insertId;
          }
        }

        return [rows, extra];
      },
      async beginTransaction() {
        // already begun
      },
      async commit() {
        await transaction.commit();
      },
      async rollback() {
        await transaction.rollback();
      },
      release() {
        // no-op
      }
    };
  }
};

module.exports = db;
