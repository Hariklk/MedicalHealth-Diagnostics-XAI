const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

async function migrateTable(localConn, cleverConn, tableName) {
    console.log(`Migrating table: ${tableName}...`);
    
    // Check if table exists locally
    try {
        const [tables] = await localConn.query(`SHOW TABLES LIKE '${tableName}'`);
        if (tables.length === 0) {
            console.log(`- Table ${tableName} does not exist locally. Skipping.`);
            return;
        }
    } catch (err) {
        console.log(`- Skipping check for ${tableName}: ${err.message}`);
        return;
    }

    const [rows] = await localConn.query(`SELECT * FROM ${tableName}`);
    if (rows.length === 0) {
        console.log(`- Table ${tableName} is empty. Skipping.`);
        return;
    }
    
    const columns = Object.keys(rows[0]);
    const columnsList = columns.map(c => `\`${c}\``).join(', ');
    const placeholders = columns.map(() => '?').join(', ');
    const insertQuery = `INSERT IGNORE INTO ${tableName} (${columnsList}) VALUES (${placeholders})`;
    
    let count = 0;
    for (let row of rows) {
        const values = columns.map(col => {
            let val = row[col];
            // Format dates correctly or JSON fields
            if (val && typeof val === 'object' && !(val instanceof Date)) {
                return JSON.stringify(val);
            }
            return val;
        });
        await cleverConn.query(insertQuery, values);
        count++;
    }
    console.log(`- Successfully migrated ${count} rows to ${tableName}`);
}

async function run() {
    console.log('Connecting to local MySQL and Clever Cloud MySQL...');
    let localConn, cleverConn;
    try {
        // Connect to local MySQL using the previous known credentials
        localConn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'hari@2004',
            database: 'medical_portal'
        });

        // Connect to Clever Cloud MySQL
        cleverConn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: parseInt(process.env.DB_PORT || '3306')
        });

        const tables = [
            'users',
            'patients',
            'medical_professionals',
            'otps',
            'overall_heart_analysis',
            'heart_failure_analysis',
            'cancer_analysis',
            'cad_analysis',
            'arrhythmia_analysis',
            'valvular_analysis',
            'congenital_analysis',
            'cardiomyopathy_analysis',
            'inflammatory_analysis',
            'skin_analysis',
            'kidney_analysis',
            'cognitive_analysis',
            'stomach_analysis',
            'brain_tumor_general_analysis',
            'anemia_analysis'
        ];

        for (let table of tables) {
            await migrateTable(localConn, cleverConn, table);
        }

        console.log('\n✅ Database migration to Clever Cloud completed successfully.');

    } catch (err) {
        console.error('❌ Migration failed:', err.message);
    } finally {
        if (localConn) await localConn.end();
        if (cleverConn) await cleverConn.end();
    }
}

run();
