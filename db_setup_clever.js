const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

async function setupDatabase() {
    console.log('Connecting to Clever Cloud MySQL database...');
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: parseInt(process.env.DB_PORT || '3306'),
            multipleStatements: true
        });

        console.log('✅ Connected. Setting up tables...');

        // 1. Users Table
        console.log('Creating users table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                fullname VARCHAR(255),
                email VARCHAR(255) UNIQUE,
                password VARCHAR(255),
                role ENUM('user', 'professional') DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 2. Patients Table
        console.log('Creating patients table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS patients (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT UNIQUE,
                gender VARCHAR(50),
                age INT,
                height VARCHAR(50),
                weight VARCHAR(50),
                blood_group VARCHAR(10),
                medical_history TEXT,
                medical_report LONGTEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // 3. Medical Professionals Table
        console.log('Creating medical_professionals table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS medical_professionals (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT UNIQUE,
                gender VARCHAR(50),
                medical_professional VARCHAR(100),
                specialization VARCHAR(255),
                license_number VARCHAR(255),
                hospital_name VARCHAR(255),
                experience_years INT,
                country VARCHAR(100),
                consultation_fee INT,
                contact_number VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // 4. OTPs Table
        console.log('Creating otps table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS otps (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255),
                otp VARCHAR(6),
                expires_at DATETIME
            )
        `);

        // 5. Overall Heart Analysis Table
        console.log('Creating overall_heart_analysis table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS overall_heart_analysis (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                age INT,
                sex INT,
                cp INT,
                trestbps INT,
                chol INT,
                fbs INT,
                restecg INT,
                thalach INT,
                exang INT,
                oldpeak FLOAT,
                slope INT,
                ca INT,
                thal INT,
                smoking TINYINT(1) DEFAULT 0,
                drinking TINYINT(1) DEFAULT 0,
                leg_pain TINYINT(1) DEFAULT 0,
                sob TINYINT(1) DEFAULT 0,
                ankle_swelling TINYINT(1) DEFAULT 0,
                risk_percentage FLOAT,
                risk_status VARCHAR(50),
                message TEXT,
                accuracy FLOAT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // 6. Heart Failure Analysis Table
        console.log('Creating heart_failure_analysis table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS heart_failure_analysis (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                age INT,
                sex VARCHAR(10),
                chest_pain_type VARCHAR(50),
                resting_bp INT,
                cholesterol INT,
                fasting_bs INT,
                resting_ecg VARCHAR(50),
                max_hr INT,
                exercise_angina VARCHAR(10),
                oldpeak FLOAT,
                st_slope VARCHAR(50),
                swelling_legs TINYINT(1) DEFAULT 0,
                rapid_heartbeat TINYINT(1) DEFAULT 0,
                wheezing TINYINT(1) DEFAULT 0,
                swelling_belly TINYINT(1) DEFAULT 0,
                rapid_weight_gain TINYINT(1) DEFAULT 0,
                difficulty_concentrating TINYINT(1) DEFAULT 0,
                risk_percentage FLOAT,
                risk_status VARCHAR(50),
                message TEXT,
                prediction VARCHAR(10),
                accuracy FLOAT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // 7. Cancer Analysis Table
        console.log('Creating cancer_analysis table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS cancer_analysis (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                cancer_type VARCHAR(100),
                risk_percentage FLOAT,
                risk_status VARCHAR(50),
                message TEXT,
                diagnostic_data JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // 8. CAD Analysis Table
        console.log('Creating cad_analysis table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS cad_analysis (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                age INT,
                gender VARCHAR(20),
                chest_pain VARCHAR(50),
                bp INT,
                cholesterol INT,
                diabetes VARCHAR(10),
                smoking VARCHAR(20),
                heart_rate INT,
                history VARCHAR(10),
                risk_percentage FLOAT,
                risk_status VARCHAR(50),
                message TEXT,
                accuracy FLOAT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // 9. Arrhythmia Analysis Table
        console.log('Creating arrhythmia_analysis table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS arrhythmia_analysis (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                age INT,
                gender VARCHAR(20),
                pulse_regularity VARCHAR(50),
                resting_hr INT,
                palpitations TINYINT(1) DEFAULT 0,
                dizziness TINYINT(1) DEFAULT 0,
                risk_percentage FLOAT,
                risk_status VARCHAR(50),
                message TEXT,
                accuracy FLOAT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // 10. Valvular Analysis Table
        console.log('Creating valvular_analysis table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS valvular_analysis (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                age INT,
                gender VARCHAR(20),
                murmur_detected TINYINT(1) DEFAULT 0,
                fatigue_level VARCHAR(50),
                shortness_of_breath TINYINT(1) DEFAULT 0,
                risk_percentage FLOAT,
                risk_status VARCHAR(50),
                message TEXT,
                accuracy FLOAT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // 11. Congenital Analysis Table
        console.log('Creating congenital_analysis table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS congenital_analysis (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                age INT,
                family_history TINYINT(1) DEFAULT 0,
                cyanosis TINYINT(1) DEFAULT 0,
                growth_issues TINYINT(1) DEFAULT 0,
                risk_percentage FLOAT,
                risk_status VARCHAR(50),
                message TEXT,
                accuracy FLOAT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // 12. Cardiomyopathy Analysis Table
        console.log('Creating cardiomyopathy_analysis table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS cardiomyopathy_analysis (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                age INT,
                heart_enlargement TINYINT(1) DEFAULT 0,
                fluid_retention TINYINT(1) DEFAULT 0,
                exercise_intolerance TINYINT(1) DEFAULT 0,
                risk_percentage FLOAT,
                risk_status VARCHAR(50),
                message TEXT,
                accuracy FLOAT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // 13. Inflammatory Analysis Table
        console.log('Creating inflammatory_analysis table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS inflammatory_analysis (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                age INT,
                fever TINYINT(1) DEFAULT 0,
                chest_pain_sharp TINYINT(1) DEFAULT 0,
                recent_infection TINYINT(1) DEFAULT 0,
                risk_percentage FLOAT,
                risk_status VARCHAR(50),
                message TEXT,
                accuracy FLOAT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // 14. Skin Analysis Table
        console.log('Creating skin_analysis table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS skin_analysis (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                age INT,
                gender VARCHAR(20),
                skin_type INT,
                asymmetry TINYINT(1) DEFAULT 0,
                border TINYINT(1) DEFAULT 0,
                diameter TINYINT(1) DEFAULT 0,
                evolution TINYINT(1) DEFAULT 0,
                symptoms TINYINT(1) DEFAULT 0,
                risk_percentage FLOAT,
                risk_status VARCHAR(50),
                message TEXT,
                accuracy FLOAT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // 15. Kidney Analysis Table
        console.log('Creating kidney_analysis table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS kidney_analysis (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                age INT,
                gender VARCHAR(20),
                hydration VARCHAR(20),
                pain TINYINT(1) DEFAULT 0,
                blood TINYINT(1) DEFAULT 0,
                nausea TINYINT(1) DEFAULT 0,
                history TINYINT(1) DEFAULT 0,
                calcium TINYINT(1) DEFAULT 0,
                risk_percentage FLOAT,
                risk_status VARCHAR(50),
                message TEXT,
                accuracy FLOAT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // 16. Cognitive Analysis Table
        console.log('Creating cognitive_analysis table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS cognitive_analysis (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                age INT,
                education INT,
                gender VARCHAR(20),
                memory INT,
                confusion TINYINT(1) DEFAULT 0,
                speech TINYINT(1) DEFAULT 0,
                mood TINYINT(1) DEFAULT 0,
                stroke TINYINT(1) DEFAULT 0,
                risk_percentage FLOAT,
                risk_status VARCHAR(50),
                message TEXT,
                accuracy FLOAT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // 17. Stomach Analysis Table
        console.log('Creating stomach_analysis table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS stomach_analysis (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                age INT,
                gender VARCHAR(20),
                bmi VARCHAR(20),
                pain TINYINT(1) DEFAULT 0,
                bloating TINYINT(1) DEFAULT 0,
                weight_loss TINYINT(1) DEFAULT 0,
                eating_pain TINYINT(1) DEFAULT 0,
                alcohol INT,
                risk_percentage FLOAT,
                risk_status VARCHAR(50),
                message TEXT,
                accuracy FLOAT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // 18. Brain Tumor General Analysis Table
        console.log('Creating brain_tumor_general_analysis table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS brain_tumor_general_analysis (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                location VARCHAR(50),
                size INT,
                contrast INT,
                headache TINYINT(1) DEFAULT 0,
                seizures TINYINT(1) DEFAULT 0,
                vision TINYINT(1) DEFAULT 0,
                nausea TINYINT(1) DEFAULT 0,
                weakness TINYINT(1) DEFAULT 0,
                risk_percentage FLOAT,
                risk_status VARCHAR(50),
                message TEXT,
                accuracy FLOAT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // 19. Anemia Analysis Table
        console.log('Creating anemia_analysis table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS anemia_analysis (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                age INT,
                gender VARCHAR(20),
                diet VARCHAR(20),
                hb FLOAT,
                mcv FLOAT,
                ferritin FLOAT,
                fatigue VARCHAR(20),
                sob TINYINT(1) DEFAULT 0,
                risk_percentage FLOAT,
                risk_status VARCHAR(50),
                message TEXT,
                accuracy FLOAT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        console.log('✅ All MySQL tables set up successfully on Clever Cloud.');

    } catch (error) {
        console.error('❌ Error setting up Clever Cloud MySQL database:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

setupDatabase();
