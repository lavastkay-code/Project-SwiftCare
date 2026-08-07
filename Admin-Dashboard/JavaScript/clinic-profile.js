const form = document.getElementById('clinicForm');

const phoneInput = document.getElementById('phone');

const profileInput = document.getElementById('profileInput');
const addProfileBtn = document.getElementById('addProfileBtn');
const removeProfileBtn = document.getElementById('removeProfileBtn');

const previewImage = document.getElementById('previewImage');
const placeholder = document.getElementById('placeholder');


phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/[^0-9]/g, '');
});


addProfileBtn.addEventListener('click', () => {
    profileInput.click();
});


profileInput.addEventListener('change', (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png'
    ];

    if (!allowedTypes.includes(file.type)) {
        alert('Please select a JPG or PNG image.');
        profileInput.value = '';
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {

        previewImage.src = event.target.result;
        previewImage.style.display = 'block';

        placeholder.style.display = 'none';

        addProfileBtn.textContent = 'Change Profile Picture';

        removeProfileBtn.disabled = false;
    };

    reader.readAsDataURL(file);
});


removeProfileBtn.addEventListener('click', () => {

    profileInput.value = '';

    previewImage.src = '';
    previewImage.style.display = 'none';

    placeholder.style.display = 'flex';

    addProfileBtn.textContent = 'Add Profile Picture';

    removeProfileBtn.disabled = true;
});

form.addEventListener('submit', (e) => {

    e.preventDefault();

    const requiredFields = form.querySelectorAll('[required]');

    let isValid = true;

    requiredFields.forEach(field => {

        if (!field.value.trim()) {

            isValid = false;

            field.style.borderColor = '#dc2626';

            field.addEventListener('input', () => {
                field.style.borderColor = '#d5deea';
            }, { once: true });
        }
    });

    const email = document.getElementById('email');

    if (email && email.value.trim()) {

        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

        if (!emailRegex.test(email.value.trim())) {

            alert('Please enter a valid email address.');

            email.focus();
            return;
        }
    }

    if (phoneInput.value.length < 7) {

        alert('Please enter a valid phone number.');

        phoneInput.focus();
        return;
    }

    if (!isValid) {

        alert('Please fill in all required fields.');

        return;
    }
    window.location.href = 'general-settings.html';
});

const discardBtn = document.querySelector('.discard-btn');

discardBtn.addEventListener('click', () => {

    const confirmReset = confirm(
        'Are you sure you want to discard your changes?'
    );

    if (confirmReset) {

        form.reset();

        profileInput.value = '';

        previewImage.src = '';
        previewImage.style.display = 'none';

        placeholder.style.display = 'flex';

        addProfileBtn.textContent = 'Add Profile Picture';

        removeProfileBtn.disabled = true;
    }
});


const allInputs = document.querySelectorAll('input, select');

allInputs.forEach(input => {

    input.addEventListener('focus', () => {
        input.style.borderColor = '#2563eb';
    });

    input.addEventListener('blur', () => {

        if (input.value.trim()) {
            input.style.borderColor = '#d5deea';
        }
    });
});


phoneInput.addEventListener('keypress', (e) => {

    const charCode = e.which || e.keyCode;

    if (charCode < 48 || charCode > 57) {
        e.preventDefault();
    }
});