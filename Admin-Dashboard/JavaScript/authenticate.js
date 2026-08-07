const emailInput = document.getElementById('email');
const emailError = document.getElementById('emailError');
const continueLink = document.getElementById('continueLink');

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

emailInput.addEventListener('input', () => {

    emailInput.value = emailInput.value.trimStart();

    if (validateEmail(emailInput.value.trim())) {
        emailError.textContent = '';
    }
});

continueLink.addEventListener('click', (e) => {

    const email = emailInput.value.trim();

     if (email === true) {
        alert('A new verification code has been sent to your email.');
        return;
    }

    

    if (!email) {

        e.preventDefault();

        emailError.textContent = 'Please enter your email address.';
        emailInput.focus();

        return;
    }

    if (!validateEmail(email)) {

        e.preventDefault();

        emailError.textContent = 'Please enter a valid email address.';
        emailInput.focus();

        return;
    }

    emailError.textContent = '';

    localStorage.setItem(
        'swiftcareVerificationEmail',
        email
    );
    
    alert('A new verification code has been sent to your email.');
});

