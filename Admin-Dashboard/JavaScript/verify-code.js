const otpInputs = document.querySelectorAll('.otp-input');
const continueLink = document.getElementById('continueLink');
const resendLink = document.getElementById('resendLink');
const maskedEmail = document.getElementById('maskedEmail');

const savedEmail = localStorage.getItem('swiftcareVerificationEmail');

if (savedEmail) {

    const [name, domain] = savedEmail.split('@');

    const masked =
        name.length <= 2
            ? '*'.repeat(name.length)
            : name.slice(0, 2) + '*'.repeat(Math.max(name.length - 2, 2));

    maskedEmail.textContent = `${masked}@${domain}`;
}

function updateContinueState() {

    const code = [...otpInputs].map(input => input.value).join('');

    if (code.length === 4) {

        continueLink.classList.add('enabled');
        continueLink.classList.remove('disabled');

    } else {

        continueLink.classList.remove('enabled');
        continueLink.classList.add('disabled');
    }
}

otpInputs.forEach((input, index) => {

    input.addEventListener('input', (e) => {

        input.value = input.value.replace(/\D/g, '');

        if (input.value && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }

        updateContinueState();
    });

    input.addEventListener('keydown', (e) => {

        if (e.key === 'Backspace' && !input.value && index > 0) {
            otpInputs[index - 1].focus();
        }
    });

    input.addEventListener('paste', (e) => {

        e.preventDefault();

        const pasted = (e.clipboardData.getData('text') || '')
            .replace(/\D/g, '')
            .slice(0, 4);

        pasted.split('').forEach((digit, i) => {
            if (otpInputs[i]) otpInputs[i].value = digit;
        });

        otpInputs[Math.min(pasted.length, 3)].focus();

        updateContinueState();
    });
});


continueLink.addEventListener('click', (e) => {
    e.preventDefault();

    const code = [...otpInputs].map(input => input.value).join('');

    if (code.length !== 4) {
        return;
    }

    localStorage.setItem('swiftcareVerificationCode', code);

    alert('Verification successful!');

    window.location.href = 'verification-successful.html';
});