const form = document.getElementById('signupForm');

const clinicName = document.getElementById('clinicName');
const phone = document.getElementById('phone');

const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');

const togglePassword = document.getElementById('togglePassword');
const toggleConfirm = document.getElementById('toggleConfirm');

const strengthText = document.getElementById('strengthText');
const strengthFill = document.getElementById('strengthFill');

const ruleLength = document.getElementById('ruleLength');
const ruleUpper = document.getElementById('ruleUpper');
const ruleSymbol = document.getElementById('ruleSymbol');
const ruleNumber = document.getElementById('ruleNumber');

clinicName.addEventListener('input', () => {
    clinicName.value = clinicName.value.replace(/[^a-zA-Z\\s]/g, '');
});

phone.addEventListener('input', () => {
    phone.value = phone.value.replace(/[^0-9]/g, '');
});

function toggleVisibility(input, button) {

    const icon = button.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    }
}

togglePassword.addEventListener('mousedown', e => e.preventDefault());
toggleConfirm.addEventListener('mousedown', e => e.preventDefault());

togglePassword.addEventListener('click', () => {
    toggleVisibility(password, togglePassword);
});

toggleConfirm.addEventListener('click', () => {
    toggleVisibility(confirmPassword, toggleConfirm);
});

password.addEventListener('input', updateStrength);

function updateRule(element, valid) {
    element.classList.toggle('valid', valid);
}

function updateStrength() {

    const value = password.value;

    const hasLength = value.length >= 8;
    const hasUpper = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSymbol = /[^A-Za-z0-9]/.test(value);

    updateRule(ruleLength, hasLength);
    updateRule(ruleUpper, hasUpper);
    updateRule(ruleNumber, hasNumber);
    updateRule(ruleSymbol, hasSymbol);

    let score = 0;

    if (hasLength) score++;
    if (hasUpper) score++;
    if (hasNumber) score++;
    if (hasSymbol) score++;

    switch (score) {

        case 0:
        case 1:
            strengthText.textContent = 'Weak';
            strengthText.style.color = '#dc2626';
            strengthFill.style.width = '25%';
            strengthFill.style.background = '#dc2626';
            break;

        case 2:
            strengthText.textContent = 'Fair';
            strengthText.style.color = '#f59e0b';
            strengthFill.style.width = '50%';
            strengthFill.style.background = '#f59e0b';
            break;

        case 3:
            strengthText.textContent = 'Good';
            strengthText.style.color = '#2563eb';
            strengthFill.style.width = '75%';
            strengthFill.style.background = '#2563eb';
            break;

        case 4:
            strengthText.textContent = 'Strong';
            strengthText.style.color = '#16a34a';
            strengthFill.style.width = '100%';
            strengthFill.style.background = '#16a34a';
            break;
    }
}

form.addEventListener('submit', e => {

    e.preventDefault();

    const passwordValue = password.value.trim();
    const confirmValue = confirmPassword.value.trim();

    const hasLength = passwordValue.length >= 8;
    const hasUpper = /[A-Z]/.test(passwordValue);
    const hasLower = /[a-z]/.test(passwordValue);
    const hasNumber = /[0-9]/.test(passwordValue);
    const hasSymbol = /[^A-Za-z0-9]/.test(passwordValue);

    if (!hasLength || !hasUpper || !hasLower || !hasNumber || !hasSymbol) {

        alert(
            'Password must contain:\\n\\n' +
            '• At least 8 characters\\n' +
            '• One uppercase letter\\n' +
            '• One lowercase letter\\n' +
            '• One number\\n' +
            '• One special character'
        );

        password.focus();
        return;
    }

    if (passwordValue !== confirmValue) {
        alert('Passwords do not match.');
        confirmPassword.focus();
        return;
    }

    alert('Account created successfully!');
});