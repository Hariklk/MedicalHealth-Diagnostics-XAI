const professions = [
    "Acupuncturist", "Allergist", "Anesthesiologist", "Audiologist", "Cardiologist",
    "Cardiovascular Surgeon", "Chiropractor", "Clinical Psychologist", "Colon and Rectal Surgeon",
    "Dentist", "Dermatologist", "Dietitian / Nutritionist", "Emergency Medicine Physician",
    "Endocrinologist", "Family Medicine Physician", "Gastroenterologist", "Geneticist",
    "Geriatrician", "Gynecologist", "Hematologist", "Hospice and Palliative Care Specialist",
    "Infectious Disease Specialist", "Internal Medicine Physician", "Medical Geneticist",
    "Nephrologist", "Neurologist", "Neurosurgeon", "Nurse Practitioner", "Obstetrician",
    "Occupational Therapist", "Oncologist", "Ophthalmologist", "Optometrist", "Oral Surgeon",
    "Orthopedic Surgeon", "Otolaryngologist (ENT)", "Pain Management Specialist", "Pathologist",
    "Pediatrician", "Pharmacist", "Physical Therapist", "Physiatrist", "Plastic Surgeon",
    "Podiatrist", "Psychiatrist", "Pulmonologist", "Radiologist", "Rheumatologist",
    "Sleep Medicine Specialist", "Sports Medicine Specialist", "Surgeon", "Therapist",
    "Thoracic Surgeon", "Urologist", "Vascular Surgeon", "Veterinarian"
];

const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
    "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
    "Denmark", "Djibouti", "Dominica", "Dominican Republic",
    "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
    "Fiji", "Finland", "France",
    "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
    "Haiti", "Honduras", "Hungary",
    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast",
    "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
    "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
    "Oman",
    "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
    "Qatar",
    "Romania", "Russia", "Rwanda",
    "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
    "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
    "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
    "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
    "Yemen",
    "Zambia", "Zimbabwe"
];

document.addEventListener('DOMContentLoaded', () => {
    // --- DEMO MODE: Auto-login with demo user ---
    if (!localStorage.getItem('userId')) {
        localStorage.setItem('userId', '1');
        localStorage.setItem('userFullname', 'Jane Doe');
        localStorage.setItem('userRole', 'user');
        localStorage.setItem('isProfileCompleted', 'true');
    }

    // Auto-redirect from login/signup pages to dashboard (demo mode)
    const currentPage = window.location.href;
    if (currentPage.includes('index.html') || (currentPage.endsWith('/') && !currentPage.includes('medical.html')) || currentPage.includes('signup.html')) {
        // Only redirect if we're on the login or signup page
        const isLoginPage = document.getElementById('loginForm');
        const isSignupPage = document.getElementById('signupForm');
        if (isLoginPage || isSignupPage) {
            window.location.href = 'medical.html';
            return;
        }
    }

    // --- 0. Theme Initialization ---
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }

    // --- 0.1 Profile Skip / Auto-Redirect Logic ---
    const url = window.location.href;
    const isProfilePage = url.includes('profile.html');
    const isCompleted = localStorage.getItem('isProfileCompleted') === 'true';
    const isEditMode = url.includes('edit=true');

    if (isProfilePage && isCompleted && !isEditMode) {
        console.log('Profile already completed. Redirecting to dashboard...');
        window.location.href = 'medical.html';
    }

    // --- 0.2 Dashboard Initialization ---
    const userNameSidebar = document.getElementById('userNameSidebar');
    if (userNameSidebar) {
        userNameSidebar.innerText = localStorage.getItem('userFullname') || 'Patient';
    }

    // Global Logout Function
    window.logout = () => {
        localStorage.clear();
        window.location.href = 'index.html';
    };

    const logoutBtn = document.querySelector('.logout-btn, .logout-btn-full');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.logout();
        });
    }

    // --- 0.3 Global Settings Logic ---
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsDropdown = document.getElementById('settingsDropdown');
    const themeToggle = document.getElementById('themeToggle');

    if (settingsBtn && settingsDropdown) {
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsDropdown.classList.toggle('active');
        });
        document.addEventListener('click', () => settingsDropdown.classList.remove('active'));
        settingsDropdown.addEventListener('click', (e) => e.stopPropagation());
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }
    // --- 1. Generic Password Visibility Toggle ---
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const inputField = btn.parentElement.querySelector('input');
            const icon = btn.querySelector('ion-icon');
            if (inputField) {
                const type = inputField.getAttribute('type') === 'password' ? 'text' : 'password';
                inputField.setAttribute('type', type);
                icon.setAttribute('name', type === 'text' ? 'eye-outline' : 'eye-off-outline');
            }
        });
    });

    // --- 1.1 Google Button Redirection ---
    document.querySelectorAll('.social-btn.google').forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = 'google-redirect.html';
        });
    });

    // --- 2. 3D Tilt Effect ---
    const activeCard = document.querySelector('.login-card');
    if (activeCard && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            const xPos = (clientX / innerWidth - 0.5) * 2;
            const yPos = (clientY / innerHeight - 0.5) * 2;
            activeCard.style.transform = `perspective(1000px) rotateX(${yPos * -5}deg) rotateY(${xPos * 5}deg)`;
        });
        document.addEventListener('mouseleave', () => {
            activeCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        });
    }

    // --- Helper: Shake Animation ---
    const shakeElement = (element) => {
        element.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(0)' }
        ], { duration: 300, iterations: 1 });
    };

    // --- 3. Login Form Handling ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            document.querySelectorAll('.input-group').forEach(group => group.classList.remove('error'));

            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');

            if (!emailInput.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
                const group = emailInput.closest('.input-group');
                group.classList.add('error');
                shakeElement(group);
                isValid = false;
            }
            if (!passwordInput.value) {
                const group = passwordInput.closest('.input-group');
                group.classList.add('error');
                shakeElement(group);
                isValid = false;
            }

            if (isValid) {
                handleAuth('/api/login', {
                    email: emailInput.value,
                    password: passwordInput.value
                }, loginForm.querySelector('.submit-btn'), 'Signing In...', 'Login Successful!');
            }
        });
    }

    // --- 4. Signup Form Handling ---
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            document.querySelectorAll('.input-group').forEach(group => group.classList.remove('error'));

            const fullname = document.getElementById('fullname');
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirm-password');
            const role = signupForm.querySelector('input[name="role"]:checked');

            if (!fullname.value.trim()) { fullname.closest('.input-group').classList.add('error'); isValid = false; }
            if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
                const g = email.closest('.input-group'); g.classList.add('error'); shakeElement(g); isValid = false;
            }
            if (!password.value) { password.closest('.input-group').classList.add('error'); isValid = false; }
            if (password.value !== confirmPassword.value) {
                const g = confirmPassword.closest('.input-group'); g.classList.add('error'); isValid = false;
            }

            if (isValid) {
                handleAuth('/api/signup', {
                    fullname: fullname.value,
                    email: email.value,
                    password: password.value,
                    role: role ? role.value : 'user'
                }, signupForm.querySelector('.submit-btn'), 'Creating Account...', 'Account Created!');
            }
        });
    }

    // --- 5. Profile Form Handling ---
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        const userId = localStorage.getItem('userId');
        const userRole = localStorage.getItem('userRole') || 'user';

        if (!userId) {
            // Demo mode: set default user instead of redirecting
            localStorage.setItem('userId', '1');
            localStorage.setItem('userFullname', 'Jane Doe');
            localStorage.setItem('userRole', 'user');
            localStorage.setItem('isProfileCompleted', 'true');
        }
        {
            // Update UI based on role
            const userSection = document.getElementById('section-user');
            const proSection = document.getElementById('section-professional');
            const title = document.getElementById('profile-title');
            const subtitle = document.getElementById('profile-subtitle');

            // Populate Dropdowns
            const professionSelect = document.getElementById('profession-type');
            const countrySelect = document.getElementById('pro-country');

            if (professionSelect) {
                professions.forEach(p => {
                    const opt = document.createElement('option');
                    opt.value = p;
                    opt.textContent = p;
                    professionSelect.appendChild(opt);
                });
            }

            if (countrySelect) {
                countries.forEach(c => {
                    const opt = document.createElement('option');
                    opt.value = c;
                    opt.textContent = c;
                    countrySelect.appendChild(opt);
                });
            }

            const btnUserMode = document.getElementById('btn-user-mode');
            const btnProMode = document.getElementById('btn-pro-mode');

            const switchMode = (mode) => {
                const isPro = mode === 'professional';

                // Toggle Buttons
                btnUserMode.classList.toggle('active', !isPro);
                btnProMode.classList.toggle('active', isPro);

                // Toggle Sections
                userSection.style.display = isPro ? 'none' : 'block';
                proSection.style.display = isPro ? 'block' : 'none';

                // Update Text
                title.innerText = isPro ? 'Professional Profile' : 'Medical Profile';
                subtitle.innerText = isPro ? 'Verify your medical expertise.' : 'Complete your patient records.';

                // Track active mode on the form
                profileForm.dataset.activeMode = mode;
            };

            // Set Initial Mode
            switchMode(userRole);

            // Add Switch Handlers
            btnUserMode.addEventListener('click', () => switchMode('user'));
            btnProMode.addEventListener('click', () => switchMode('professional'));

            // Fetch Existing Data
            fetch(`http://localhost:3000/api/get-profile?userId=${userId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.user) {
                        const u = data.user;

                        // If profile is completed, show the skip/back button
                        const skipBtn = document.getElementById('skip-profile-btn');
                        if (skipBtn && (u.age || u.specialization)) { // Very basic check for completion
                            skipBtn.style.display = 'flex';
                            localStorage.setItem('isProfileCompleted', 'true');

                            skipBtn.addEventListener('click', () => {
                                const role = localStorage.getItem('userRole');
                                if (role === 'user') {
                                    window.location.href = 'medical.html';
                                } else {
                                    alert('Dashboard for professionals coming soon!');
                                }
                            });
                        }

                        document.getElementById('profile-name').value = u.fullname || localStorage.getItem('userFullname');

                        if (u.medical_professional) document.getElementById('profession-type').value = u.medical_professional;
                        if (u.country) document.getElementById('pro-country').value = u.country;
                        if (u.hospital_name) document.getElementById('pro-hospital').value = u.hospital_name;
                        if (u.specialization) document.getElementById('pro-specialization').value = u.specialization;
                        if (u.license_number) document.getElementById('pro-license').value = u.license_number;
                        if (u.experience_years) document.getElementById('pro-experience').value = u.experience_years;
                        if (u.consultation_fee) document.getElementById('pro-fee').value = u.consultation_fee;
                        if (u.contact_number) document.getElementById('pro-contact').value = u.contact_number;

                        if (u.gender) {
                            const genField = document.getElementById('gender');
                            const proGenField = document.getElementById('pro-gender');
                            if (genField) genField.value = u.gender;
                            if (proGenField) proGenField.value = u.gender;
                        }
                        if (u.age) document.getElementById('age').value = u.age;
                        if (u.height) document.getElementById('height').value = u.height;
                        if (u.weight) document.getElementById('weight').value = u.weight;
                        if (u.blood_group) document.getElementById('blood-group').value = u.blood_group;
                        if (u.medical_history) document.getElementById('medical-history').value = u.medical_history;

                        if (u.medical_report && u.medical_report.length > 50) {
                            const linkDiv = document.getElementById('existing-report-link');
                            const link = linkDiv.querySelector('a');
                            link.href = u.medical_report;
                            linkDiv.style.display = 'block';
                        }
                    }
                });
        }

        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userId = localStorage.getItem('userId');
            const activeMode = profileForm.dataset.activeMode || 'user';

            const submitProfile = (base64Report) => {
                let payload = { userId, role: activeMode, fullname: document.getElementById('profile-name').value };

                if (activeMode === 'professional') {
                    payload.gender = document.getElementById('pro-gender').value;
                    payload.medical_professional = document.getElementById('profession-type').value;
                    payload.country = document.getElementById('pro-country').value;
                    payload.hospital_name = document.getElementById('pro-hospital').value;
                    payload.specialization = document.getElementById('pro-specialization').value;
                    payload.license_number = document.getElementById('pro-license').value;
                    payload.experience_years = document.getElementById('pro-experience').value;
                    payload.consultation_fee = document.getElementById('pro-fee').value;
                    payload.contact_number = document.getElementById('pro-contact').value;
                } else {
                    payload.gender = document.getElementById('gender').value;
                    payload.age = document.getElementById('age').value;
                    payload.height = document.getElementById('height').value;
                    payload.weight = document.getElementById('weight').value;
                    payload.blood_group = document.getElementById('blood-group').value;
                    payload.medical_history = document.getElementById('medical-history').value;
                    payload.medical_report = base64Report;
                }

                handleAuth('/api/update-profile', payload, profileForm.querySelector('.submit-btn'), 'Saving...', 'Profile Saved!');
            };

            if (activeMode === 'user') {
                const fileInput = document.getElementById('medical-report');
                const file = fileInput.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (evt) => submitProfile(evt.target.result);
                    reader.readAsDataURL(file);
                } else {
                    const linkDiv = document.getElementById('existing-report-link');
                    submitProfile(linkDiv.style.display !== 'none' ? linkDiv.querySelector('a').href : undefined);
                }
            } else {
                submitProfile();
            }
        });
    }

    // --- 6. Backend Auth Helper ---
    async function handleAuth(endpoint, payload, btn, loadingText, successText) {
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `<ion-icon name="sync-outline" class="spin"></ion-icon> ${loadingText}`;
        btn.disabled = true;

        try {
            const response = await fetch(`http://localhost:3000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();

            if (response.ok) {
                btn.innerHTML = `<ion-icon name="checkmark-circle-outline"></ion-icon> ${successText}`;
                btn.style.background = 'var(--success-color)';

                if (data.user || data.userId) {
                    const user = data.user || data;
                    localStorage.setItem('userId', data.user ? data.user.id : data.userId);
                    localStorage.setItem('userFullname', user.fullname || (payload ? payload.fullname : 'User'));
                    localStorage.setItem('userRole', user.role || (payload ? payload.role : 'user'));

                    // Store profile completion status
                    const isCompleted = user.isProfileCompleted === true || user.isProfileCompleted === 'true';
                    localStorage.setItem('isProfileCompleted', isCompleted ? 'true' : 'false');
                }

                setTimeout(() => {
                    if (endpoint.includes('signup') || endpoint.includes('login')) {
                        const isCompleted = localStorage.getItem('isProfileCompleted') === 'true';
                        if (isCompleted) {
                            window.location.href = 'medical.html';
                        } else {
                            window.location.href = 'profile.html';
                        }
                    } else if (endpoint.includes('update-profile')) {
                        localStorage.setItem('isProfileCompleted', 'true');
                        const role = localStorage.getItem('userRole');
                        if (role === 'user') {
                            window.location.href = 'medical.html';
                        }
                    }
                    btn.innerHTML = originalHtml;
                    btn.disabled = false;
                    btn.style.background = '';
                }, 1000);
            } else {
                throw new Error(data.error || 'Request failed');
            }
        } catch (error) {
            btn.innerHTML = `<ion-icon name="alert-circle-outline"></ion-icon> Failed`;
            btn.style.background = 'var(--error-color)';
            setTimeout(() => {
                alert(error.message);
                btn.innerHTML = originalHtml;
                btn.disabled = false;
                btn.style.background = '';
            }, 1000);
        }
    }

    // --- 7.5 Heart Analysis Modal Trigger ---
    // --- 7.5 Heart Analysis Redirection ---
    const heartAnalysisBtn = document.getElementById('btn-heart-analysis');
    if (heartAnalysisBtn) {
        heartAnalysisBtn.addEventListener('click', () => {
            window.location.href = 'heart-analysis.html';
        });
    }

    const cancerAnalysisBtn = document.getElementById('btn-cancer-analysis');
    if (cancerAnalysisBtn) {
        cancerAnalysisBtn.addEventListener('click', () => {
            window.location.href = 'cancer-analysis.html';
        });
    }

    // Optional: Also redirect when clicking the card icon for better UX
    const heartIcon = document.querySelector('.card-icon.heart');
    if (heartIcon) {
        heartIcon.parentElement.style.cursor = 'pointer';
        heartIcon.parentElement.addEventListener('click', (e) => {
            if (e.target.closest('.terminal-btn')) return;
            window.location.href = 'heart-analysis.html';
        });
    }

    const cancerIcon = document.querySelector('.card-icon.cancer');
    if (cancerIcon) {
        cancerIcon.parentElement.style.cursor = 'pointer';
        cancerIcon.parentElement.addEventListener('click', (e) => {
            if (e.target.closest('.terminal-btn')) return;
            window.location.href = 'cancer-analysis.html';
        });
    }

    // Handle Diagnostic Option Clicks
    document.querySelectorAll('.diag-opt-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const option = this.querySelector('span').innerText;
            // Simulated Launch
            const originalContent = this.innerHTML;
            this.innerHTML = `<ion-icon name="sync-outline" class="spin"></ion-icon> <span>Connecting...</span>`;
            this.style.borderColor = 'var(--primary-color)';
            this.disabled = true;

            setTimeout(() => {
                alert(`Real-time Heart Analysis for "${option}" is being initialized.\n\nNote: This is a diagnostic simulation.`);
                this.innerHTML = originalContent;
                this.disabled = false;
            }, 1200);
        });
    });

    // --- 8. Info FAB & Modals Logic ---
    const fabMain = document.getElementById('fabMain');
    const fabMenu = document.getElementById('fabMenu');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeButtons = document.querySelectorAll('.close-modal');
    const fabItems = document.querySelectorAll('.fab-item');

    if (fabMain) {
        fabMain.addEventListener('click', (e) => {
            e.stopPropagation();
            fabMenu.classList.toggle('active');
        });

        // Close FAB menu when clicking outside
        document.addEventListener('click', () => {
            fabMenu.classList.remove('active');
        });
    }

    if (fabItems) {
        fabItems.forEach(item => {
            item.addEventListener('click', () => {
                const modalId = item.getAttribute('data-modal');
                const modal = document.getElementById(modalId);

                if (modal) {
                    modalOverlay.classList.add('active');
                    modal.classList.add('active');
                    fabMenu.classList.remove('active');
                }
            });
        });
    }

    if (closeButtons) {
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                modalOverlay.classList.remove('active');
                document.querySelectorAll('.info-modal').forEach(m => m.classList.remove('active'));
            });
        });
    }

    // Close modal on overlay click
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
                document.querySelectorAll('.info-modal').forEach(m => m.classList.remove('active'));
            }
        });
    }

    // --- 9. Forgot Password Logic ---
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const modalForgot = document.getElementById('modal-forgot-password');
    const step1 = document.getElementById('forgot-step-1');
    const step2 = document.getElementById('forgot-step-2');
    const step3 = document.getElementById('forgot-step-3');
    const btnSendOtp = document.getElementById('btn-send-otp');
    const btnVerifyOtp = document.getElementById('btn-verify-otp');
    const btnResetPassword = document.getElementById('btn-reset-password');

    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            modalOverlay.classList.add('active');
            modalForgot.classList.add('active');
            // Reset steps
            step1.style.display = 'block';
            step2.style.display = 'none';
            step3.style.display = 'none';
        });
    }

    if (btnSendOtp) {
        btnSendOtp.addEventListener('click', async () => {
            const email = document.getElementById('forgot-email').value;
            if (!email) return alert('Please enter your email.');

            btnSendOtp.disabled = true;
            btnSendOtp.innerHTML = '<span>Sending...</span>';

            try {
                const res = await fetch('http://localhost:3000/api/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const data = await res.json();
                if (res.ok) {
                    document.getElementById('display-email').innerText = email;
                    step1.style.display = 'none';
                    step2.style.display = 'block';
                } else {
                    alert(data.error);
                }
            } catch (err) {
                alert('Error sending OTP.');
            } finally {
                btnSendOtp.disabled = false;
                btnSendOtp.innerHTML = '<span>Send OTP</span>';
            }
        });
    }

    if (btnVerifyOtp) {
        btnVerifyOtp.addEventListener('click', async () => {
            const email = document.getElementById('forgot-email').value;
            const otp = document.getElementById('forgot-otp').value;
            if (!otp) return alert('Please enter OTP.');

            btnVerifyOtp.disabled = true;
            btnVerifyOtp.innerHTML = '<span>Verifying...</span>';

            try {
                const res = await fetch('http://localhost:3000/api/verify-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, otp })
                });
                const data = await res.json();
                if (res.ok) {
                    step2.style.display = 'none';
                    step3.style.display = 'block';
                } else {
                    alert(data.error);
                }
            } catch (err) {
                alert('Error verifying OTP.');
            } finally {
                btnVerifyOtp.disabled = false;
                btnVerifyOtp.innerHTML = '<span>Verify OTP</span>';
            }
        });
    }

    if (btnResetPassword) {
        btnResetPassword.addEventListener('click', async () => {
            const email = document.getElementById('forgot-email').value;
            const otp = document.getElementById('forgot-otp').value;
            const newPassword = document.getElementById('forgot-new-password').value;
            const confirmPassword = document.getElementById('forgot-confirm-password').value;

            if (newPassword !== confirmPassword) return alert('Passwords do not match.');
            if (!newPassword) return alert('Please enter a new password.');

            btnResetPassword.disabled = true;
            btnResetPassword.innerHTML = '<span>Resetting...</span>';

            try {
                const res = await fetch('http://localhost:3000/api/reset-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, otp, newPassword })
                });
                const data = await res.json();
                if (res.ok) {
                    alert('Password reset successfully! You can now login.');
                    modalOverlay.classList.remove('active');
                    modalForgot.classList.remove('active');
                } else {
                    alert(data.error);
                }
            } catch (err) {
                alert('Error resetting password.');
            } finally {
                btnResetPassword.disabled = false;
                btnResetPassword.innerHTML = '<span>Reset Password</span>';
            }
        });
    }

    // --- 9.5 Mouse Parallax Effect ---
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const mouseX = (clientX - centerX) / centerX;
        const mouseY = (clientY - centerY) / centerY;

        // Apply to shapes
        document.querySelectorAll('.shape').forEach((shape, index) => {
            const speed = (index + 1) * 20;
            const x = mouseX * speed;
            const y = mouseY * speed;
            shape.style.transform = `translate(${x}px, ${y}px)`;
        });

        // Medical Parallax Items
        document.querySelectorAll('.parallax-medical-item').forEach((item, index) => {
            const speed = (index + 1) * 40; // Higher speed for more depth
            const x = mouseX * speed;
            const y = mouseY * speed;
            const rotate = mouseX * 10; // Slight rotation
            item.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
        });

        // Dynamic light follow effect
        const aura = document.querySelector('.aura-overlay');
        if (aura) {
            aura.style.background = `radial-gradient(circle at ${clientX}px ${clientY}px, rgba(14, 165, 233, 0.15) 0%, transparent 80%)`;
        }

        // Slight parallax for particles if any
        document.querySelectorAll('.floating-particle').forEach((p, i) => {
            const speed = (i % 5 + 1) * 30;
            const x = mouseX * speed;
            const y = mouseY * speed;
            p.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    function createParticles() {
        const bg = document.querySelector('.medical-background');
        if (!bg) return;
        for (let i = 0; i < 50; i++) {
            const p = document.createElement('div');
            p.className = 'floating-particle';
            p.style.top = Math.random() * 100 + '%';
            p.style.left = Math.random() * 100 + '%';
            bg.appendChild(p);
        }
    }

    function injectMedicalParallax() {
        const bg = document.querySelector('.medical-background');
        if (!bg) return;

        // Add Aura Overlay if not present
        if (!document.querySelector('.aura-overlay')) {
            const aura = document.createElement('div');
            aura.className = 'aura-overlay';
            bg.appendChild(aura);
        }

        const items = [
            { icon: 'dna-outline', class: 'parallax-dna' },
            { icon: 'flask-outline', class: 'parallax-molecule' },
            { icon: 'git-network-outline', class: 'parallax-neural ai-item' },
            { icon: 'pulse-outline', class: 'parallax-pulse' },
            { icon: 'barcode-outline', class: 'parallax-brain ai-item' },
            { icon: 'hardware-chip-outline', class: 'parallax-chip ai-item' },
            { icon: 'planet-outline', class: 'parallax-robot ai-item' },
            { icon: 'heart-half-outline', class: 'parallax-heart' },
            { icon: 'flask-outline', class: 'parallax-flask' },
            { icon: 'infinite-outline', class: 'parallax-neural ai-item' },
            { icon: 'medkit-outline', class: 'parallax-pulse' }
        ];

        items.forEach((item, index) => {
            const el = document.createElement('div');
            el.className = `parallax-medical-item ${item.class}`;
            el.innerHTML = `<ion-icon name="${item.icon}"></ion-icon>`;

            // Random initial positions
            el.style.top = Math.random() * 80 + 10 + '%';
            el.style.left = Math.random() * 80 + 10 + '%';

            bg.appendChild(el);
        });
    }

    createParticles();
    injectMedicalParallax();

    // --- 9.6 Scroll Parallax for Dashboard ---
    const diagnosticGrid = document.querySelector('.diagnostic-grid');
    if (diagnosticGrid) {
        diagnosticGrid.addEventListener('scroll', () => {
            const scrolled = diagnosticGrid.scrollTop;
            const cards = diagnosticGrid.querySelectorAll('.model-card');

            cards.forEach((card, index) => {
                const speed = 0.05 * (index % 3 + 1);
                const yPos = -(scrolled * speed);
                // Instead of moving the whole card (which breaks layout), we can move children
                const icon = card.querySelector('.card-icon');
                if (icon) icon.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    // --- 10. Reports Logic ---
    window.openReportsModal = async function (e) {
        if (e) e.preventDefault();
        const reportsModal = document.getElementById('reportsModal');
        if (reportsModal) {
            reportsModal.classList.add('active');
            // Show loading state
            const reportsList = document.getElementById('reportsList');
            if (reportsList) {
                reportsList.innerHTML = `
                    <div class="no-reports">
                        <ion-icon name="sync-outline" class="spin" style="font-size: 40px;"></ion-icon>
                        <p>Syncing your diagnostic history...</p>
                    </div>
                `;
            }
            await fetchReports();
        }
    };

    window.closeReportsModal = function () {
        const reportsModal = document.getElementById('reportsModal');
        if (reportsModal) reportsModal.classList.remove('active');
    };

    async function fetchReports() {
        const reportsList = document.getElementById('reportsList');
        if (!reportsList) return;

        const userId = localStorage.getItem('userId') || '1';

        try {
            const response = await fetch(`/api/get-reports?userId=${userId}`);
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();

            if (data.reports && data.reports.length > 0) {
                renderReports(data.reports);
            } else {
                reportsList.innerHTML = `
                    <div class="no-reports">
                        <ion-icon name="document-text-outline"></ion-icon>
                        <p>No diagnostic reports found in your history.</p>
                        <span style="font-size: 12px; margin-top:-10px; opacity:0.7;">Complete a heart analysis to see results here.</span>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
            reportsList.innerHTML = `
                <div class="no-reports">
                    <ion-icon name="cloud-offline-outline" style="color: #f43f5e;"></ion-icon>
                    <p>Connection error. Unable to retrieve reports.</p>
                </div>
            `;
        }
    }

    function renderReports(reports) {
        const reportsList = document.getElementById('reportsList');
        if (!reportsList) return;

        reportsList.innerHTML = '';
        reports.forEach(report => {
            const dateStr = new Date(report.created_at).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric'
            });
            const timeStr = new Date(report.created_at).toLocaleTimeString('en-GB', {
                hour: '2-digit', minute: '2-digit'
            });

            let badgeClass = 'rep-badge-low';
            if (report.risk_status === 'high' || report.risk_status === 'critical') badgeClass = 'rep-badge-high';
            else if (report.risk_status === 'moderate') badgeClass = 'rep-badge-moderate';

            const card = document.createElement('div');
            card.className = 'report-card';
            card.innerHTML = `
                <div class="rep-header">
                    <div class="rep-info">
                        <h4>${report.report_display_type || report.report_type}</h4>
                        <div class="rep-date">
                            <ion-icon name="calendar-outline"></ion-icon> ${dateStr}
                            <ion-icon name="time-outline" style="margin-left: 10px;"></ion-icon> ${timeStr}
                        </div>
                    </div>
                    <span class="rep-badge ${badgeClass}">${report.risk_status || 'Unknown'} Risk</span>
                </div>
                <div class="rep-details">
                    <div class="rep-item">
                        <label>Risk Score</label>
                        <span>${report.risk_percentage ?? 'N/A'}%</span>
                    </div>
                    <div class="rep-item">
                        <label>Model Confidence</label>
                        <span>${report.accuracy ?? 'N/A'}%</span>
                    </div>
                    ${report.prediction ? `
                    <div class="rep-item">
                        <label>AI Prediction</label>
                        <span style="color: #f43f5e;">${report.prediction}</span>
                    </div>` : ''}
                    ${report.message ? `
                    <div class="rep-msg">
                        <ion-icon name="information-circle-outline" style="vertical-align: middle; margin-right: 5px;"></ion-icon>
                        ${report.message}
                    </div>` : ''}
                </div>
                <button class="rep-ai-assist" onclick="triggerReportAiAssist('${(report.report_display_type || report.report_type).replace(/'/g, "\\'")}', '${report.risk_percentage}', '${report.risk_status}', \`${(report.message || "").replace(/`/g, "\\`").replace(/\${/g, "\\${")}\`)">
                    <ion-icon name="medkit-outline"></ion-icon>
                    <span>Analyze with Assistant</span>
                </button>
            `;
            reportsList.appendChild(card);
        });

        // Add global click-to-close for all modal overlays
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('active');
                    overlay.style.display = 'none'; // Fallback for pages not using .active yet
                }
            });
        });
    }

    // --- 11. Dashboard View Management & Premium AI Chat ---
    const navDiagnostics = document.getElementById('nav-diagnostics');
    const navAiAssistant = document.getElementById('nav-ai-assistant');
    const diagnosticsView = document.getElementById('diagnostics-view');
    const aiAssistantView = document.getElementById('ai-assistant-view');

    // Navigation Switching Logic
    if (navDiagnostics && navAiAssistant) {
        navDiagnostics.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            navDiagnostics.classList.add('active');

            if (aiAssistantView) aiAssistantView.classList.remove('active');
            if (diagnosticsView) diagnosticsView.classList.add('active');
        });

        navAiAssistant.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            navAiAssistant.classList.add('active');

            if (diagnosticsView) diagnosticsView.classList.remove('active');
            if (aiAssistantView) aiAssistantView.classList.add('active');

            const chatInput = document.getElementById('mainChatInput');
            if (chatInput) chatInput.focus();
        });
    }

    // Integrated Chat Implementation
    const mainChatMessages = document.getElementById('mainChatMessages');
    const mainChatInput = document.getElementById('mainChatInput');
    const mainSendMessage = document.getElementById('mainSendMessage');

    if (mainChatMessages && mainChatInput) {
        let chatHistory = [];

        const appendMessage = (role, text, suggestedModel = null) => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${role === 'user' ? 'user-message' : 'ai-message'}`;
            const avatarIcon = role === 'user' ? 'person-outline' : 'pulse';

            let dynamicContent = `<p>${text.replace(/\n/g, '<br>')}</p>`;
            if (suggestedModel) {
                dynamicContent += `
                    <div class="suggestion-chips" style="margin-top: 15px;">
                        <button class="chip model-direct-link" data-target="${suggestedModel.id}">
                            <ion-icon name="${suggestedModel.icon}"></ion-icon>
                            <span>Launch ${suggestedModel.name}</span>
                        </button>
                    </div>
                `;
            }

            msgDiv.innerHTML = `
                <div class="msg-avatar"><ion-icon name="${avatarIcon}"></ion-icon></div>
                <div class="msg-content">
                    ${dynamicContent}
                </div>
            `;

            mainChatMessages.appendChild(msgDiv);

            // Add listener for new model links
            const newLink = msgDiv.querySelector('.model-direct-link');
            if (newLink) {
                newLink.addEventListener('click', () => {
                    const targetId = newLink.getAttribute('data-target');
                    if (targetId === 'heart-analysis') window.location.href = 'heart-analysis.html';
                    else if (targetId === 'cancer-analysis') window.location.href = 'cancer-analysis.html';
                    else if (targetId === 'blood-analysis') window.location.href = 'blood-immune-analysis.html';
                    else {
                        // For others, just go back to terminal and alert
                        const navDiag = document.getElementById('nav-diagnostics');
                        if (navDiag) navDiag.click();
                        setTimeout(() => {
                            alert(`Initializing ${newLink.querySelector('span').innerText}...`);
                        }, 500);
                    }
                });
            }

            mainChatMessages.scrollTop = mainChatMessages.scrollHeight;
        };

        const handleChat = async () => {
            const message = mainChatInput.value.trim();
            if (!message) return;

            // Append User Message
            appendMessage('user', message);
            mainChatInput.value = '';

            // Add Loading State
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'message ai-message';
            loadingDiv.innerHTML = `
                <div class="msg-avatar"><ion-icon name="pulse"></ion-icon></div>
                <div class="msg-content">
                    <p><ion-icon name="sync-outline" class="spin"></ion-icon> Analyzing neural data...</p>
                </div>
            `;
            mainChatMessages.appendChild(loadingDiv);
            mainChatMessages.scrollTop = mainChatMessages.scrollHeight;

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message,
                        history: chatHistory.slice(-6)
                    })
                });

                const data = await response.json();
                mainChatMessages.removeChild(loadingDiv);

                if (data.message) {
                    // Keyword Based Model Suggestions
                    let suggestion = null;
                    const query = message.toLowerCase();

                    if (query.includes('heart') || query.includes('cardio') || query.includes('chest pain')) {
                        suggestion = { id: 'heart-analysis', name: 'Heart Disease Analysis', icon: 'heart-pulse-outline' };
                    } else if (query.includes('cancer') || query.includes('tumor') || query.includes('oncology')) {
                        suggestion = { id: 'cancer-analysis', name: 'Cancer Diagnostic', icon: 'shield-half-outline' };
                    } else if (query.includes('blood') || query.includes('immune') || query.includes('anemia')) {
                        suggestion = { id: 'blood-analysis', name: 'Blood & Immune Analysis', icon: 'water-outline' };
                    } else if (query.includes('skin') || query.includes('rash') || (query.includes('dermat') && !query.includes('under'))) {
                        suggestion = { id: 'skin-analysis', name: 'Skin Diagnostic', icon: 'finger-print-outline' };
                    } else if (query.includes('brain') || query.includes('headache') || query.includes('neuro') || query.includes('cognitive')) {
                        suggestion = { id: 'brain-analysis', name: 'Brain/Cognitive Diagnostic', icon: 'layers-outline' };
                    } else if (query.includes('kidney') || query.includes('stone')) {
                        suggestion = { id: 'kidney-analysis', name: 'Kidney Stone screening', icon: 'copy-outline' };
                    }

                    appendMessage('assistant', data.message, suggestion);
                    chatHistory.push({ role: 'user', content: message });
                    chatHistory.push({ role: 'assistant', content: data.message });
                } else {
                    appendMessage('assistant', "Neural engine encountered a synchronization error. Please try again.");
                }
            } catch (error) {
                if (loadingDiv.parentNode) mainChatMessages.removeChild(loadingDiv);
                console.error('Chat Error:', error);
                appendMessage('assistant', "Connection to the clinical neural cloud was interrupted.");
            }
        };

        if (mainSendMessage) mainSendMessage.addEventListener('click', handleChat);
        mainChatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChat();
        });

        // Exit Chat Button
        const exitChatBtn = document.getElementById('exitChatBtn');
        if (exitChatBtn) {
            exitChatBtn.addEventListener('click', () => {
                navDiagnostics.click();
            });
        }

        // New Chat / Clear Chat Logic
        const newChatBtn = document.querySelector('.new-chat-btn');
        if (newChatBtn) {
            newChatBtn.addEventListener('click', () => {
                const confirmClear = confirm("Are you sure you want to start a new clinical session?");
                if (confirmClear) {
                    mainChatMessages.innerHTML = `
                        <div class="message ai-message">
                            <div class="msg-avatar"><ion-icon name="pulse"></ion-icon></div>
                            <div class="msg-content">
                                <p>New clinical session started. How can I assist your medical analysis today?</p>
                                <div class="suggestion-chips">
                                    <button class="chip">Analyze Symptoms</button>
                                    <button class="chip">Drug Interactions</button>
                                    <button class="chip">Risk Assessment</button>
                                </div>
                            </div>
                        </div>
                    `;
                    chatHistory = [];
                    // Rebined chips
                    mainChatMessages.querySelectorAll('.chip').forEach(chip => {
                        chip.addEventListener('click', () => {
                            mainChatInput.value = chip.innerText;
                            handleChat();
                        });
                    });
                }
            });
        }


        // Handle Suggestion Chips
        document.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', () => {
                mainChatInput.value = chip.innerText;
                handleChat();
            });
        });

        // Check for pending AI analysis from diagnostic pages (e.g. Heart Health)
        const pendingAnalysis = sessionStorage.getItem('pendingAiAnalysis');
        const urlParams = new URLSearchParams(window.location.search);
        if (pendingAnalysis && urlParams.get('action') === 'chat') {
            setTimeout(() => {
                const navAiAssistant = document.getElementById('nav-ai-assistant');
                if (navAiAssistant) navAiAssistant.click();

                mainChatInput.value = `I just completed a Heart Health Diagnostic. Here are my results for deeper analysis:\n\n${pendingAnalysis}\n\nPlease analyze these symptoms and provide medical insights.`;
                handleChat();
                sessionStorage.removeItem('pendingAiAnalysis');

                // Clean up URL
                const newUrl = window.location.pathname;
                window.history.replaceState({}, document.title, newUrl);
            }, 600);
        }
    }
});

// Global helper for diagnostic report AI assistance
window.triggerReportAiAssist = (type, risk, status, msg) => {
    const isModalOpen = document.getElementById('reportsModal').classList.contains('active');
    
    const summary = `Historical Diagnostic Report Context:
- Diagnostic Type: ${type}
- Calculated Risk: ${risk}%
- Clinical Status: ${status}
- Clinical Findings: ${msg}`;

    if (isModalOpen) {
        // Handle inside modal
        const chatPane = document.getElementById('reportsChatPane');
        chatPane.classList.remove('collapsed');
        
        const chatMessages = document.getElementById('reportChatMessages');
        chatMessages.innerHTML = `
            <div class="message ai-message mini">
                <div class="msg-content">
                    <p>I've analyzed your <strong>${type}</strong> report. Risk level is <strong>${status}</strong> (${risk}%).</p>
                    <p>What would you like to know about these findings?</p>
                </div>
            </div>
        `;
        // Store current context for the mini chat
        window.currentReportContext = summary;
    } else {
        // Redirect to main chat
        sessionStorage.setItem('pendingAiAnalysis', summary);
        window.location.href = 'medical.html?action=chat';
    }
};

window.toggleReportChat = () => {
    document.getElementById('reportsChatPane').classList.toggle('collapsed');
};

// Mini Chat Logic for Reports Modal
const reportChatInput = document.getElementById('reportChatInput');
const sendReportMessage = document.getElementById('sendReportMessage');
const reportChatMessages = document.getElementById('reportChatMessages');

if (reportChatInput && sendReportMessage) {
    const handleReportChat = async () => {
        const message = reportChatInput.value.trim();
        if (!message) return;

        // Append User
        const userMsg = document.createElement('div');
        userMsg.className = 'message user-message mini';
        userMsg.innerHTML = `<div class="msg-content"><p>${message}</p></div>`;
        reportChatMessages.appendChild(userMsg);
        reportChatInput.value = '';
        reportChatMessages.scrollTop = reportChatMessages.scrollHeight;

        // Loading
        const loading = document.createElement('div');
        loading.className = 'message ai-message mini';
        loading.innerHTML = `<div class="msg-content"><p><ion-icon name="sync-outline" class="spin"></ion-icon> Analyzing...</p></div>`;
        reportChatMessages.appendChild(loading);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    message: `Context: ${window.currentReportContext || 'No specific report selected.'}\n\nUser Question: ${message}`,
                    history: []
                })
            });
            const data = await res.json();
            reportChatMessages.removeChild(loading);
            
            const aiMsg = document.createElement('div');
            aiMsg.className = 'message ai-message mini';
            aiMsg.innerHTML = `<div class="msg-content"><p>${data.message}</p></div>`;
            reportChatMessages.appendChild(aiMsg);
        } catch (e) {
            reportChatMessages.removeChild(loading);
            alert("Assistant offline.");
        }
        reportChatMessages.scrollTop = reportChatMessages.scrollHeight;
    };

    sendReportMessage.addEventListener('click', handleReportChat);
    reportChatInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') handleReportChat(); });
}
