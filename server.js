require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// In-Memory Mock Database
const users = [
    {
        id: 1,
        fullname: 'Jane Doe',
        email: 'patient@example.com',
        password: 'password123',
        role: 'user',
        created_at: new Date().toISOString()
    },
    {
        id: 2,
        fullname: 'Dr. John Smith',
        email: 'doctor@example.com',
        password: 'password123',
        role: 'professional',
        created_at: new Date().toISOString()
    }
];

const patients = {
    1: {
        user_id: 1,
        gender: 'Female',
        age: 35,
        height: '165 cm',
        weight: '60 kg',
        blood_group: 'O+',
        medical_history: 'No significant past medical history.',
        medical_report: '',
        updated_at: new Date().toISOString()
    }
};

const medical_professionals = {
    2: {
        user_id: 2,
        gender: 'Male',
        medical_professional: 'Cardiologist',
        specialization: 'Cardiovascular Diseases',
        license_number: 'LIC987654321',
        hospital_name: 'Metro Cardiology Center',
        experience_years: 12,
        country: 'United States',
        consultation_fee: 150,
        contact_number: '+1-555-0199',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
};

const otps = [];

// Analysis report history tables
const overall_heart_analysis = [
    {
        id: 101,
        user_id: 1,
        age: 35,
        sex: 0,
        cp: 1,
        trestbps: 120,
        chol: 220,
        fbs: 0,
        restecg: 1,
        thalach: 150,
        exang: 0,
        oldpeak: 1.0,
        slope: 2,
        ca: 0,
        thal: 2,
        smoking: 0,
        drinking: 0,
        leg_pain: 0,
        sob: 0,
        ankle_swelling: 0,
        risk_percentage: 12.5,
        risk_status: 'Low Risk',
        message: 'Your cardiovascular diagnostic parameters are within normal ranges. Maintain a healthy lifestyle.',
        accuracy: 94.2,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
];
const heart_failure_analysis = [];
const cancer_analysis = [
    {
        id: 201,
        user_id: 1,
        cancer_type: 'Breast Cancer',
        risk_percentage: 8.4,
        risk_status: 'Low Risk',
        message: 'Based on the entered biomarkers and symptoms, your breast cancer risk index is low.',
        diagnostic_data: { clump_thickness: 5, uniformity_cell_size: 1, uniformity_cell_shape: 1 },
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
];
const cad_analysis = [];
const arrhythmia_analysis = [];
const valvular_analysis = [];
const congenital_analysis = [];
const cardiomyopathy_analysis = [];
const inflammatory_analysis = [];
const skin_analysis = [];
const kidney_analysis = [];
const cognitive_analysis = [];
const stomach_analysis = [];
const brain_tumor_general_analysis = [];
const anemia_analysis = [];

// Email Transporter (User needs to fill EMAIL_USER and EMAIL_PASS in .env)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

console.log('Using In-Memory Mock Database. MySQL connections are removed.');

// Routes

// 1. Signup Route
app.post('/api/signup', (req, res) => {
    const { fullname, email, password, role } = req.body;

    if (!fullname || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const userRole = role || 'user';
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        return res.status(400).json({ error: 'Email already exists.' });
    }

    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = {
        id: newId,
        fullname,
        email,
        password,
        role: userRole,
        created_at: new Date().toISOString()
    };
    users.push(newUser);

    res.status(201).json({
        message: 'User registered successfully.',
        userId: newId,
        fullname: fullname,
        role: userRole,
        isProfileCompleted: false
    });
});

// 2. Login Route
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
        const hasProfile = (patients[user.id] !== undefined || medical_professionals[user.id] !== undefined);
        console.log(`User ${user.email} logged in. Profile status: ${hasProfile}`);
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
                isProfileCompleted: hasProfile
            }
        });
    } else {
        res.status(401).json({ error: 'Invalid email or password.' });
    }
});

// 3. Update Profile Route
app.post('/api/update-profile', (req, res) => {
    const {
        userId, role, fullname,
        gender, age, height, weight, blood_group, medical_history, medical_report,
        specialization, license_number, hospital_name, experience_years,
        medical_professional, country, consultation_fee, contact_number
    } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    const uId = parseInt(userId);
    const user = users.find(u => u.id === uId);
    if (!user) {
        return res.status(404).json({ error: 'User not found.' });
    }

    console.log('Update Request - User:', uId, 'Role:', role);
    user.fullname = fullname;
    user.role = role;

    if (role === 'professional') {
        console.log('Updating professional profile...');
        medical_professionals[uId] = {
            user_id: uId,
            gender,
            medical_professional,
            specialization,
            license_number,
            hospital_name,
            experience_years: experience_years ? parseInt(experience_years) : null,
            country,
            consultation_fee: consultation_fee ? parseInt(consultation_fee) : null,
            contact_number,
            updated_at: new Date().toISOString()
        };
        res.json({ message: 'Professional profile updated successfully.' });
    } else {
        console.log('Updating patient profile...');
        patients[uId] = {
            user_id: uId,
            gender,
            age: age ? parseInt(age) : null,
            height,
            weight,
            blood_group,
            medical_history,
            medical_report,
            updated_at: new Date().toISOString()
        };
        res.json({ message: 'Patient profile updated successfully.' });
    }
});

// 4. Get Profile Route
app.get('/api/get-profile', (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    const uId = parseInt(userId);
    const user = users.find(u => u.id === uId);
    if (!user) {
        return res.status(404).json({ error: 'User not found.' });
    }

    const patient = patients[uId] || {};
    const pro = medical_professionals[uId] || {};

    const profile = {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        gender: patient.gender || pro.gender || null,
        age: patient.age || null,
        height: patient.height || null,
        weight: patient.weight || null,
        blood_group: patient.blood_group || null,
        medical_history: patient.medical_history || null,
        medical_report: patient.medical_report || null,
        medical_professional: pro.medical_professional || null,
        specialization: pro.specialization || null,
        license_number: pro.license_number || null,
        hospital_name: pro.hospital_name || null,
        experience_years: pro.experience_years || null,
        country: pro.country || null,
        consultation_fee: pro.consultation_fee || null,
        contact_number: pro.contact_number || null
    };

    res.json({ user: profile });
});

// 5. Forgot Password - Send OTP
app.post('/api/forgot-password', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required.' });

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    otps.push({ email: email.toLowerCase(), otp, expires_at: expiresAt });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            console.error('Email send error:', err);
            return res.status(500).json({ error: 'Failed to send OTP email. Please check server configuration.' });
        }
        res.json({ message: 'OTP sent successfully to your email.' });
    });
});

// 6. Verify OTP
app.post('/api/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required.' });

    const validOtp = otps.find(o => 
        o.email.toLowerCase() === email.toLowerCase() && 
        o.otp === otp && 
        new Date(o.expires_at) > new Date()
    );

    if (!validOtp) return res.status(401).json({ error: 'Invalid or expired OTP.' });

    res.json({ message: 'OTP verified successfully.' });
});

// 7. Reset Password
app.post('/api/reset-password', (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ error: 'All fields are required.' });

    const otpIndex = otps.findIndex(o => 
        o.email.toLowerCase() === email.toLowerCase() && 
        o.otp === otp && 
        new Date(o.expires_at) > new Date()
    );

    if (otpIndex === -1) return res.status(401).json({ error: 'Invalid or expired OTP.' });

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return res.status(404).json({ error: 'User not found.' });

    user.password = newPassword;

    // Delete used OTPs for this email
    for (let i = otps.length - 1; i >= 0; i--) {
        if (otps[i].email.toLowerCase() === email.toLowerCase()) {
            otps.splice(i, 1);
        }
    }

    res.json({ message: 'Password reset successfully.' });
});


// 8. ML Heart Disease Prediction
app.post('/api/predict-heart', (req, res) => {
    const {
        age, sex, cp, trestbps, chol, fbs, restecg,
        thalach, exang, oldpeak, slope, ca, thal,
        smoking, drinking, leg_pain, sob, ankle_swelling
    } = req.body;

    // Validate inputs
    const inputs = [age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal, smoking, drinking, leg_pain, sob, ankle_swelling];
    if (inputs.some(val => val === undefined || val === '')) {
        return res.status(400).json({ status: 'error', error: 'Missing diagnostic data.' });
    }

    const { spawn } = require('child_process');
    const pythonProcess = spawn('python', ['predict_heart.py', ...inputs]);

    let dataString = '';
    let errorString = '';

    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorString += data.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python script error (code ${code}):`, errorString);
            return res.status(500).json({ status: 'error', error: `Neural Engine Error: ${errorString.split('\n').pop() || 'Process crashed'}` });
        }
        try {
            const result = JSON.parse(dataString);
            if (result.status === 'error') {
                return res.status(500).json({ status: 'error', error: result.error });
            }

            const { userId } = req.body;
            const reportId = overall_heart_analysis.length > 0 ? Math.max(...overall_heart_analysis.map(r => r.id)) + 1 : 101;
            overall_heart_analysis.push({
                id: reportId,
                user_id: userId ? parseInt(userId) : null,
                age: parseInt(age),
                sex: parseInt(sex),
                cp: parseInt(cp),
                trestbps: parseInt(trestbps),
                chol: parseInt(chol),
                fbs: parseInt(fbs),
                restecg: parseInt(restecg),
                thalach: parseInt(thalach),
                exang: parseInt(exang),
                oldpeak: parseFloat(oldpeak),
                slope: parseInt(slope),
                ca: parseInt(ca),
                thal: parseInt(thal),
                smoking: smoking ? 1 : 0,
                drinking: drinking ? 1 : 0,
                leg_pain: leg_pain ? 1 : 0,
                sob: sob ? 1 : 0,
                ankle_swelling: ankle_swelling ? 1 : 0,
                risk_percentage: parseFloat(result.risk),
                risk_status: result.risk_status,
                message: result.message,
                accuracy: parseFloat(result.accuracy),
                created_at: new Date().toISOString()
            });

            res.json(result);
        } catch (e) {
            console.error('Failed to parse Python output:', dataString);
            res.status(500).json({ status: 'error', error: 'Invalid response from AI engine.' });
        }
    });
});

// 9. Heart Failure Prediction
app.post('/api/predict-heart-failure', (req, res) => {
    const {
        userId, age, sex, chestPainType, restingBP, cholesterol, fastingBS,
        restingECG, maxHR, exerciseAngina, oldpeak, stSlope,
        swellingLegs, rapidHeartbeat, wheezing, swellingBelly, rapidWeightGain, difficultyConcentrating
    } = req.body;

    const inputs = [
        age, sex, chestPainType, restingBP, cholesterol, fastingBS,
        restingECG, maxHR, exerciseAngina, oldpeak, stSlope,
        swellingLegs, rapidHeartbeat, wheezing, swellingBelly, rapidWeightGain, difficultyConcentrating
    ];

    if (inputs.some(val => val === undefined || val === '')) {
        return res.status(400).json({ status: 'error', error: 'Missing diagnostic data.' });
    }

    const { spawn } = require('child_process');
    const pythonProcess = spawn('python', ['predict_heart_failure.py', ...inputs]);

    let dataString = '';
    let errorString = '';

    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorString += data.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python script error (code ${code}):`, errorString);
            return res.status(500).json({ status: 'error', error: `Neural Engine Error: ${errorString.split('\n').pop() || 'Process crashed'}` });
        }
        try {
            const result = JSON.parse(dataString);
            if (result.status === 'error') {
                return res.status(500).json({ status: 'error', error: result.error });
            }

            const reportId = heart_failure_analysis.length > 0 ? Math.max(...heart_failure_analysis.map(r => r.id)) + 1 : 101;
            heart_failure_analysis.push({
                id: reportId,
                user_id: userId ? parseInt(userId) : null,
                age: parseInt(age),
                sex: sex,
                chest_pain_type: chestPainType,
                resting_bp: parseInt(restingBP),
                cholesterol: parseInt(cholesterol),
                fasting_bs: parseInt(fastingBS),
                resting_ecg: restingECG,
                max_hr: parseInt(maxHR),
                exercise_angina: exerciseAngina,
                oldpeak: parseFloat(oldpeak),
                st_slope: stSlope,
                swelling_legs: swellingLegs ? 1 : 0,
                rapid_heartbeat: rapidHeartbeat ? 1 : 0,
                wheezing: wheezing ? 1 : 0,
                swelling_belly: swellingBelly ? 1 : 0,
                rapid_weight_gain: rapidWeightGain ? 1 : 0,
                difficulty_concentrating: difficultyConcentrating ? 1 : 0,
                risk_percentage: parseFloat(result.risk),
                risk_status: result.risk_status,
                message: result.message,
                prediction: result.prediction,
                accuracy: parseFloat(result.accuracy),
                created_at: new Date().toISOString()
            });

            res.json(result);
        } catch (e) {
            console.error('Failed to parse Python output:', dataString);
            res.status(500).json({ status: 'error', error: 'Invalid response from AI engine.' });
        }
    });
});

// 10. CAD Prediction
app.post('/api/predict-cad', (req, res) => {
    const {
        userId, age, sex, chestPain, bp, chol, diabetes, smoking, heartRate, history
    } = req.body;

    const inputs = [age, sex, chestPain, bp, chol, diabetes, smoking, heartRate, history];

    if (inputs.some(val => val === undefined || val === '')) {
        return res.status(400).json({ status: 'error', error: 'Missing CAD diagnostic data.' });
    }

    const { spawn } = require('child_process');
    const pythonProcess = spawn('python', ['predict_cad.py', ...inputs]);

    let dataString = '';
    let errorString = '';

    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorString += data.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python CAD script error (code ${code}):`, errorString);
            return res.status(500).json({ status: 'error', error: `Neural Engine Error: ${errorString.split('\n').pop() || 'Process crashed'}` });
        }
        try {
            const result = JSON.parse(dataString);
            if (result.status === 'error') {
                return res.status(500).json({ status: 'error', error: result.error });
            }

            const reportId = cad_analysis.length > 0 ? Math.max(...cad_analysis.map(r => r.id)) + 1 : 101;
            cad_analysis.push({
                id: reportId,
                user_id: userId ? parseInt(userId) : null,
                age: parseInt(age),
                gender: sex,
                chest_pain: chestPain,
                bp: parseInt(bp),
                cholesterol: parseInt(chol),
                diabetes: diabetes,
                smoking: smoking,
                heart_rate: parseInt(heartRate),
                history: history,
                risk_percentage: parseFloat(result.risk),
                risk_status: result.risk_status,
                message: result.message,
                accuracy: parseFloat(result.accuracy),
                created_at: new Date().toISOString()
            });

            res.json(result);
        } catch (e) {
            console.error('Failed to parse Python CAD output:', dataString);
            res.status(500).json({ status: 'error', error: 'Invalid response from AI engine.' });
        }
    });
});

// 11. Generic Cancer Analysis Save
app.post('/api/save-cancer-analysis', (req, res) => {
    const { userId, cancerType, riskPercentage, riskStatus, message, diagnosticData } = req.body;

    if (!userId || !cancerType) {
        return res.status(400).json({ error: 'User ID and Cancer Type are required.' });
    }

    const reportId = cancer_analysis.length > 0 ? Math.max(...cancer_analysis.map(r => r.id)) + 1 : 201;
    cancer_analysis.push({
        id: reportId,
        user_id: parseInt(userId),
        cancer_type: cancerType,
        risk_percentage: parseFloat(riskPercentage),
        risk_status: riskStatus,
        message: message,
        diagnostic_data: diagnosticData,
        created_at: new Date().toISOString()
    });

    res.json({ status: 'success', message: 'Analysis saved successfully' });
});

// 12. Get User Reports
app.get('/api/get-reports', (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    const uId = parseInt(userId);
    const allReports = [
        ...overall_heart_analysis.filter(r => r.user_id === uId).map(r => ({ ...r, report_display_type: 'Overall Heart Health' })),
        ...heart_failure_analysis.filter(r => r.user_id === uId).map(r => ({ ...r, report_display_type: 'Heart Failure' })),
        ...cancer_analysis.filter(r => r.user_id === uId).map(r => ({ ...r, report_display_type: r.cancer_type })),
        ...skin_analysis.filter(r => r.user_id === uId).map(r => ({ ...r, report_display_type: 'Skin Diagnostic' })),
        ...kidney_analysis.filter(r => r.user_id === uId).map(r => ({ ...r, report_display_type: 'Kidney Stone' })),
        ...cognitive_analysis.filter(r => r.user_id === uId).map(r => ({ ...r, report_display_type: 'Cognitive Diagnostic' })),
        ...stomach_analysis.filter(r => r.user_id === uId).map(r => ({ ...r, report_display_type: 'Stomach Ulcer' })),
        ...brain_tumor_general_analysis.filter(r => r.user_id === uId).map(r => ({ ...r, report_display_type: 'Brain Tumor' })),
        ...anemia_analysis.filter(r => r.user_id === uId).map(r => ({ ...r, report_display_type: 'Anemia Analysis' })),
        ...arrhythmia_analysis.filter(r => r.user_id === uId).map(r => ({ ...r, report_display_type: 'Arrhythmia Analysis' })),
        ...valvular_analysis.filter(r => r.user_id === uId).map(r => ({ ...r, report_display_type: 'Valvular Analysis' })),
        ...congenital_analysis.filter(r => r.user_id === uId).map(r => ({ ...r, report_display_type: 'Congenital Analysis' })),
        ...cardiomyopathy_analysis.filter(r => r.user_id === uId).map(r => ({ ...r, report_display_type: 'Cardiomyopathy Analysis' })),
        ...inflammatory_analysis.filter(r => r.user_id === uId).map(r => ({ ...r, report_display_type: 'Inflammatory Analysis' }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json({ reports: allReports });
});

// 13. Skin Analysis
app.post('/api/predict-skin', (req, res) => {
    const { userId, age, gender, skin_type, asymmetry, border, diameter, evolution, symptoms } = req.body;
    const { spawn } = require('child_process');
    const pythonProcess = spawn('python', ['predict_skin.py']);
    
    pythonProcess.stdin.write(JSON.stringify(req.body));
    pythonProcess.stdin.end();

    let dataString = '';
    pythonProcess.stdout.on('data', (data) => dataString += data.toString());
    pythonProcess.on('close', (code) => {
        try {
            const result = JSON.parse(dataString);
            const reportId = skin_analysis.length > 0 ? Math.max(...skin_analysis.map(r => r.id)) + 1 : 101;
            skin_analysis.push({
                id: reportId,
                user_id: userId ? parseInt(userId) : null,
                age: parseInt(age),
                gender: gender,
                skin_type: parseInt(skin_type),
                asymmetry: asymmetry ? 1 : 0,
                border: border ? 1 : 0,
                diameter: diameter ? 1 : 0,
                evolution: evolution ? 1 : 0,
                symptoms: symptoms ? 1 : 0,
                risk_percentage: parseFloat(result.risk),
                risk_status: result.risk_status,
                message: result.message,
                accuracy: parseFloat(result.accuracy),
                created_at: new Date().toISOString()
            });
            res.json(result);
        } catch (e) { res.status(500).json({ status: 'error', error: 'Neural Engine Error' }); }
    });
});

// 14. Kidney Analysis
app.post('/api/predict-kidney', (req, res) => {
    const { userId, age, gender, hydration, pain, blood, nausea, history, calcium } = req.body;
    const { spawn } = require('child_process');
    const pythonProcess = spawn('python', ['predict_kidney.py']);
    
    pythonProcess.stdin.write(JSON.stringify(req.body));
    pythonProcess.stdin.end();

    let dataString = '';
    pythonProcess.stdout.on('data', (data) => dataString += data.toString());
    pythonProcess.on('close', (code) => {
        try {
            const result = JSON.parse(dataString);
            const reportId = kidney_analysis.length > 0 ? Math.max(...kidney_analysis.map(r => r.id)) + 1 : 101;
            kidney_analysis.push({
                id: reportId,
                user_id: userId ? parseInt(userId) : null,
                age: parseInt(age),
                gender: gender,
                hydration: hydration,
                pain: pain ? 1 : 0,
                blood: blood ? 1 : 0,
                nausea: nausea ? 1 : 0,
                history: history ? 1 : 0,
                calcium: calcium ? 1 : 0,
                risk_percentage: parseFloat(result.risk),
                risk_status: result.risk_status,
                message: result.message,
                accuracy: parseFloat(result.accuracy),
                created_at: new Date().toISOString()
            });
            res.json(result);
        } catch (e) { res.status(500).json({ status: 'error', error: 'Neural Engine Error' }); }
    });
});

// 15. Cognitive Analysis
app.post('/api/predict-cognitive', (req, res) => {
    const { userId, age, education, gender, memory, confusion, speech, mood, stroke } = req.body;
    const { spawn } = require('child_process');
    const pythonProcess = spawn('python', ['predict_cognitive.py']);
    
    pythonProcess.stdin.write(JSON.stringify(req.body));
    pythonProcess.stdin.end();

    let dataString = '';
    pythonProcess.stdout.on('data', (data) => dataString += data.toString());
    pythonProcess.on('close', (code) => {
        try {
            const result = JSON.parse(dataString);
            const reportId = cognitive_analysis.length > 0 ? Math.max(...cognitive_analysis.map(r => r.id)) + 1 : 101;
            cognitive_analysis.push({
                id: reportId,
                user_id: userId ? parseInt(userId) : null,
                age: parseInt(age),
                education: parseInt(education),
                gender: gender,
                memory: parseInt(memory),
                confusion: confusion ? 1 : 0,
                speech: speech ? 1 : 0,
                mood: mood ? 1 : 0,
                stroke: stroke ? 1 : 0,
                risk_percentage: parseFloat(result.risk),
                risk_status: result.risk_status,
                message: result.message,
                accuracy: parseFloat(result.accuracy),
                created_at: new Date().toISOString()
            });
            res.json(result);
        } catch (e) { res.status(500).json({ status: 'error', error: 'Neural Engine Error' }); }
    });
});

// 16. Stomach Analysis
app.post('/api/predict-stomach', (req, res) => {
    const { userId, age, gender, bmi, pain, bloating, weight_loss, eating_pain, alcohol } = req.body;
    const { spawn } = require('child_process');
    const pythonProcess = spawn('python', ['predict_stomach.py']);
    
    pythonProcess.stdin.write(JSON.stringify(req.body));
    pythonProcess.stdin.end();

    let dataString = '';
    pythonProcess.stdout.on('data', (data) => dataString += data.toString());
    pythonProcess.on('close', (code) => {
        try {
            const result = JSON.parse(dataString);
            const reportId = stomach_analysis.length > 0 ? Math.max(...stomach_analysis.map(r => r.id)) + 1 : 101;
            stomach_analysis.push({
                id: reportId,
                user_id: userId ? parseInt(userId) : null,
                age: parseInt(age),
                gender: gender,
                bmi: bmi,
                pain: pain ? 1 : 0,
                bloating: bloating ? 1 : 0,
                weight_loss: weight_loss ? 1 : 0,
                eating_pain: eating_pain ? 1 : 0,
                alcohol: parseInt(alcohol),
                risk_percentage: parseFloat(result.risk),
                risk_status: result.risk_status,
                message: result.message,
                accuracy: parseFloat(result.accuracy),
                created_at: new Date().toISOString()
            });
            res.json(result);
        } catch (e) { res.status(500).json({ status: 'error', error: 'Neural Engine Error' }); }
    });
});

// 17. Brain Tumor Analysis
app.post('/api/predict-brain-tumor', (req, res) => {
    const { userId, location, size, contrast, headache, seizures, vision, nausea, weakness } = req.body;
    const { spawn } = require('child_process');
    const pythonProcess = spawn('python', ['predict_brain_tumor.py']);
    
    pythonProcess.stdin.write(JSON.stringify(req.body));
    pythonProcess.stdin.end();

    let dataString = '';
    pythonProcess.stdout.on('data', (data) => dataString += data.toString());
    pythonProcess.on('close', (code) => {
        try {
            const result = JSON.parse(dataString);
            const reportId = brain_tumor_general_analysis.length > 0 ? Math.max(...brain_tumor_general_analysis.map(r => r.id)) + 1 : 101;
            brain_tumor_general_analysis.push({
                id: reportId,
                user_id: userId ? parseInt(userId) : null,
                location: location,
                size: parseInt(size),
                contrast: parseInt(contrast),
                headache: headache ? 1 : 0,
                seizures: seizures ? 1 : 0,
                vision: vision ? 1 : 0,
                nausea: nausea ? 1 : 0,
                weakness: weakness ? 1 : 0,
                risk_percentage: parseFloat(result.risk),
                risk_status: result.risk_status,
                message: result.message,
                accuracy: parseFloat(result.accuracy),
                created_at: new Date().toISOString()
            });
            res.json(result);
        } catch (e) { res.status(500).json({ status: 'error', error: 'Neural Engine Error' }); }
    });
});

// 18. Anemia Analysis
app.post('/api/predict-anemia', (req, res) => {
    const { userId, age, gender, diet, hb, mcv, ferritin, fatigue, sob } = req.body;
    const { spawn } = require('child_process');
    const pythonProcess = spawn('python', ['predict_anemia.py']);
    
    pythonProcess.stdin.write(JSON.stringify(req.body));
    pythonProcess.stdin.end();

    let dataString = '';
    pythonProcess.stdout.on('data', (data) => dataString += data.toString());
    pythonProcess.on('close', (code) => {
        try {
            const result = JSON.parse(dataString);
            const reportId = anemia_analysis.length > 0 ? Math.max(...anemia_analysis.map(r => r.id)) + 1 : 101;
            anemia_analysis.push({
                id: reportId,
                user_id: userId ? parseInt(userId) : null,
                age: parseInt(age),
                gender: gender,
                diet: diet,
                hb: parseFloat(hb),
                mcv: parseFloat(mcv),
                ferritin: parseFloat(ferritin),
                fatigue: fatigue,
                sob: sob ? 1 : 0,
                risk_percentage: parseFloat(result.risk),
                risk_status: result.risk_status,
                message: result.message,
                accuracy: parseFloat(result.accuracy),
                created_at: new Date().toISOString()
            });
            res.json(result);
        } catch (e) { res.status(500).json({ status: 'error', error: 'Neural Engine Error' }); }
    });
});

// 19. Groq Chatbot Integration
app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required.' });
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'You are Health Dignostic AI, a professional medical diagnostic assistant. Your goal is to help users understand medical symptoms and provide health advice. Always include a disclaimer that you are an AI and not a replacement for professional medical advice. Be concise, empathetic, and accurate.'
                    },
                    ...(history || []),
                    { role: 'user', content: message }
                ],
                temperature: 0.9,
                max_completion_tokens: 1024
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Groq API Error:', data);
            return res.status(response.status).json({ error: 'Failed to communicate with AI engine.' });
        }

        res.json({
            message: data.choices[0].message.content,
            usage: data.usage
        });
    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ error: 'Internal server error during chat.' });
    }
});

// 14. Arrhythmia Prediction
app.post('/api/predict-arrhythmia', (req, res) => {
    const { userId, age, gender, pulse, hr, palpitations, dizziness } = req.body;
    const inputs = [age, gender, pulse, hr, palpitations, dizziness];
    
    const { spawn } = require('child_process');
    const pythonProcess = spawn('python', ['predict_arrhythmia.py', ...inputs]);

    let dataString = '';
    let errorString = '';
    pythonProcess.stdout.on('data', (data) => dataString += data.toString());
    pythonProcess.stderr.on('data', (data) => errorString += data.toString());
    
    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error('Python Error:', errorString);
            return res.status(500).json({ status: 'error', error: 'Neural Engine Error' });
        }
        try {
            const result = JSON.parse(dataString);
            const reportId = arrhythmia_analysis.length > 0 ? Math.max(...arrhythmia_analysis.map(r => r.id)) + 1 : 101;
            const uid = (userId && userId !== 'null') ? parseInt(userId) : null;
            arrhythmia_analysis.push({
                id: reportId,
                user_id: uid,
                age: parseInt(age),
                gender: gender,
                pulse_regularity: pulse,
                resting_hr: parseInt(hr),
                palpitations: palpitations ? 1 : 0,
                dizziness: dizziness ? 1 : 0,
                risk_percentage: parseFloat(result.risk),
                risk_status: result.risk_status,
                message: result.message,
                accuracy: parseFloat(result.accuracy),
                created_at: new Date().toISOString()
            });
            res.json(result);
        } catch (e) { 
            console.error('Parse Error:', e, dataString);
            res.status(500).json({ status: 'error', error: 'AI Error' }); 
        }
    });
});

// 15. Valvular Prediction
app.post('/api/predict-valvular', (req, res) => {
    const { userId, age, gender, murmur, fatigue, sob } = req.body;
    const inputs = [age, gender, murmur, fatigue, sob];
    
    const { spawn } = require('child_process');
    const pythonProcess = spawn('python', ['predict_valvular.py', ...inputs]);

    let dataString = '';
    let errorString = '';
    pythonProcess.stdout.on('data', (data) => dataString += data.toString());
    pythonProcess.stderr.on('data', (data) => errorString += data.toString());

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error('Python Error:', errorString);
            return res.status(500).json({ status: 'error', error: 'Neural Engine Error' });
        }
        try {
            const result = JSON.parse(dataString);
            const reportId = valvular_analysis.length > 0 ? Math.max(...valvular_analysis.map(r => r.id)) + 1 : 101;
            const uid = (userId && userId !== 'null') ? parseInt(userId) : null;
            valvular_analysis.push({
                id: reportId,
                user_id: uid,
                age: parseInt(age),
                gender: gender,
                murmur_detected: murmur ? 1 : 0,
                fatigue_level: fatigue,
                shortness_of_breath: sob ? 1 : 0,
                risk_percentage: parseFloat(result.risk),
                risk_status: result.risk_status,
                message: result.message,
                accuracy: parseFloat(result.accuracy),
                created_at: new Date().toISOString()
            });
            res.json(result);
        } catch (e) { 
            console.error('Parse Error:', e, dataString);
            res.status(500).json({ status: 'error', error: 'AI Error' }); 
        }
    });
});

// 16. Congenital Prediction
app.post('/api/predict-congenital', (req, res) => {
    const { userId, age, family, cyanosis, growth } = req.body;
    const inputs = [age, family, cyanosis, growth];
    
    const { spawn } = require('child_process');
    const pythonProcess = spawn('python', ['predict_congenital.py', ...inputs]);

    let dataString = '';
    let errorString = '';
    pythonProcess.stdout.on('data', (data) => dataString += data.toString());
    pythonProcess.stderr.on('data', (data) => errorString += data.toString());

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error('Python Error:', errorString);
            return res.status(500).json({ status: 'error', error: 'Neural Engine Error' });
        }
        try {
            const result = JSON.parse(dataString);
            const reportId = congenital_analysis.length > 0 ? Math.max(...congenital_analysis.map(r => r.id)) + 1 : 101;
            const uid = (userId && userId !== 'null') ? parseInt(userId) : null;
            congenital_analysis.push({
                id: reportId,
                user_id: uid,
                age: parseInt(age),
                family_history: family ? 1 : 0,
                cyanosis: cyanosis ? 1 : 0,
                growth_issues: growth ? 1 : 0,
                risk_percentage: parseFloat(result.risk),
                risk_status: result.risk_status,
                message: result.message,
                accuracy: parseFloat(result.accuracy),
                created_at: new Date().toISOString()
            });
            res.json(result);
        } catch (e) { 
            console.error('Parse Error:', e, dataString);
            res.status(500).json({ status: 'error', error: 'AI Error' }); 
        }
    });
});

// 17. Cardiomyopathy Prediction
app.post('/api/predict-cardiomyopathy', (req, res) => {
    const { userId, age, enlargement, fluid, intolerance } = req.body;
    const inputs = [age, enlargement, fluid, intolerance];
    
    const { spawn } = require('child_process');
    const pythonProcess = spawn('python', ['predict_cardiomyopathy.py', ...inputs]);

    let dataString = '';
    let errorString = '';
    pythonProcess.stdout.on('data', (data) => dataString += data.toString());
    pythonProcess.stderr.on('data', (data) => errorString += data.toString());

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error('Python Error:', errorString);
            return res.status(500).json({ status: 'error', error: 'Neural Engine Error' });
        }
        try {
            const result = JSON.parse(dataString);
            const reportId = cardiomyopathy_analysis.length > 0 ? Math.max(...cardiomyopathy_analysis.map(r => r.id)) + 1 : 101;
            const uid = (userId && userId !== 'null') ? parseInt(userId) : null;
            cardiomyopathy_analysis.push({
                id: reportId,
                user_id: uid,
                age: parseInt(age),
                heart_enlargement: enlargement ? 1 : 0,
                fluid_retention: fluid ? 1 : 0,
                exercise_intolerance: intolerance ? 1 : 0,
                risk_percentage: parseFloat(result.risk),
                risk_status: result.risk_status,
                message: result.message,
                accuracy: parseFloat(result.accuracy),
                created_at: new Date().toISOString()
            });
            res.json(result);
        } catch (e) { 
            console.error('Parse Error:', e, dataString);
            res.status(500).json({ status: 'error', error: 'AI Error' }); 
        }
    });
});

// 18. Inflammatory Prediction
app.post('/api/predict-inflammatory', (req, res) => {
    const { userId, age, fever, pain, infection } = req.body;
    const inputs = [age, fever, pain, infection];
    
    const { spawn } = require('child_process');
    const pythonProcess = spawn('python', ['predict_inflammatory.py', ...inputs]);

    let dataString = '';
    let errorString = '';
    pythonProcess.stdout.on('data', (data) => dataString += data.toString());
    pythonProcess.stderr.on('data', (data) => errorString += data.toString());

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error('Python Error:', errorString);
            return res.status(500).json({ status: 'error', error: 'Neural Engine Error' });
        }
        try {
            const result = JSON.parse(dataString);
            const reportId = inflammatory_analysis.length > 0 ? Math.max(...inflammatory_analysis.map(r => r.id)) + 1 : 101;
            const uid = (userId && userId !== 'null') ? parseInt(userId) : null;
            inflammatory_analysis.push({
                id: reportId,
                user_id: uid,
                age: parseInt(age),
                fever: fever ? 1 : 0,
                chest_pain_sharp: pain ? 1 : 0,
                recent_infection: infection ? 1 : 0,
                risk_percentage: parseFloat(result.risk),
                risk_status: result.risk_status,
                message: result.message,
                accuracy: parseFloat(result.accuracy),
                created_at: new Date().toISOString()
            });
            res.json(result);
        } catch (e) { 
            console.error('Parse Error:', e, dataString);
            res.status(500).json({ status: 'error', error: 'AI Error' }); 
        }
    });
});

// 19. Universal Cancer Prediction
app.post('/api/predict-cancer', (req, res) => {
    const { type, userId, ...diagnosticData } = req.body;
    
    // Extract inputs in order (simplified for this generic route)
    // In a real app, you'd map specific keys based on 'type'
    const inputs = Object.values(diagnosticData);

    const { spawn } = require('child_process');
    const pythonProcess = spawn('python', ['predict_cancer.py', type, ...inputs]);

    let dataString = '';
    let errorString = '';
    pythonProcess.stdout.on('data', (data) => dataString += data.toString());
    pythonProcess.stderr.on('data', (data) => errorString += data.toString());

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python ${type} cancer error (code ${code}):`, errorString);
            return res.status(500).json({ status: 'error', error: `Neural Engine Error: ${errorString.split('\n').pop() || 'Process crashed'}` });
        }
        try {
            const result = JSON.parse(dataString);
            if (result.status === 'error') {
                return res.status(500).json({ status: 'error', error: result.error });
            }

            const reportId = cancer_analysis.length > 0 ? Math.max(...cancer_analysis.map(r => r.id)) + 1 : 201;
            cancer_analysis.push({
                id: reportId,
                user_id: userId ? parseInt(userId) : null,
                cancer_type: type,
                risk_percentage: parseFloat(result.risk),
                risk_status: result.risk_status,
                message: result.message,
                diagnostic_data: diagnosticData,
                created_at: new Date().toISOString()
            });
            res.json(result);
        } catch (e) {
            console.error(`Failed to parse Python ${type} output:`, dataString);
            res.status(500).json({ status: 'error', error: 'Invalid response from AI engine.' });
        }
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
