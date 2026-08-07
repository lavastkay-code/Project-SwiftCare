const settingsForm = document.getElementById('settingsForm');


const backBtn = document.getElementById('backBtn');


const dayChips = document.querySelectorAll('.day-chip');


const timezoneSelect = document.getElementById('timezone');
const currencySelect = document.getElementById('currency');
const dateFormatSelect = document.getElementById('dateFormat');
const durationSelect = document.getElementById('duration');

const allowBooking = document.getElementById('allowBooking');
const sendReminders = document.getElementById('sendReminders');


dayChips.forEach(chip => {

    const checkbox = chip.querySelector('input');

    checkbox.addEventListener('change', () => {

        if (checkbox.checked) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });
});


const selectBoxes = document.querySelectorAll('.select-box select');

selectBoxes.forEach(select => {

    select.addEventListener('focus', () => {
        select.parentElement.classList.add('focused');
    });

    select.addEventListener('blur', () => {
        select.parentElement.classList.remove('focused');
    });
});


if (backBtn) {
    backBtn.addEventListener('click', function (e) {

        e.preventDefault();

        const confirmBack = confirm(
            'Are you sure you want to go back? Any unsaved changes may be lost?'
        );

        if (confirmBack) {

            // go to previous page
            // window.history.back();

            window.location.href = 'clinic-profile.html';
        }
    });
}


settingsForm.addEventListener('submit', (e) => {

    e.preventDefault();

    const selectedDays = [];

    document
        .querySelectorAll('.day-chip input:checked')
        .forEach(day => {
            selectedDays.push(day.value);
        });

    if (selectedDays.length === 0) {

        alert('Please select at least one working day.');

        return;
    }

    if (!timezoneSelect.value) {

        alert('Please select a time zone.');

        timezoneSelect.focus();

        return;
    }

    if (!currencySelect.value) {

        alert('Please select a currency.');

        currencySelect.focus();

        return;
    }

    if (!dateFormatSelect.value) {

        alert('Please select a date format.');

        dateFormatSelect.focus();

        return;
    }

    if (!durationSelect.value) {

        alert('Please select an appointment duration.');

        durationSelect.focus();

        return;
    }

    const operationalSettings = {
        workingDays: selectedDays,
        timezone: timezoneSelect.value,
        currency: currencySelect.value,
        dateFormat: dateFormatSelect.value,
        appointmentDuration: durationSelect.value,
        allowAppointmentBooking: allowBooking.checked,
        sendAppointmentReminders: sendReminders.checked
    };

    localStorage.setItem(
        'swiftcareOperationalSettings',
        JSON.stringify(operationalSettings)
    );

    console.log('Operational Settings Saved:', operationalSettings);

    alert('Operational settings saved successfully!');

    window.location.href = 'review.html';
});


let autoSaveTimer;

settingsForm.addEventListener('change', () => {

    clearTimeout(autoSaveTimer);

    autoSaveTimer = setTimeout(() => {

        const selectedDays = [];

        document
            .querySelectorAll('.day-chip input:checked')
            .forEach(day => {
                selectedDays.push(day.value);
            });

        const autoSavedSettings = {
            workingDays: selectedDays,
            timezone: timezoneSelect.value,
            currency: currencySelect.value,
            dateFormat: dateFormatSelect.value,
            appointmentDuration: durationSelect.value,
            allowAppointmentBooking: allowBooking.checked,
            sendAppointmentReminders: sendReminders.checked
        };

        localStorage.setItem(
            'swiftcareOperationalSettings',
            JSON.stringify(autoSavedSettings)
        );

        console.log('Settings auto-saved');

    }, 800);
});


window.addEventListener('DOMContentLoaded', () => {

    const savedSettings = localStorage.getItem(
        'swiftcareOperationalSettings'
    );

    if (!savedSettings) return;

    try {

        const settings = JSON.parse(savedSettings);

        if (settings.workingDays) {

            dayChips.forEach(chip => {

                const checkbox = chip.querySelector('input');

                checkbox.checked = settings.workingDays.includes(
                    checkbox.value
                );

                if (checkbox.checked) {
                    chip.classList.add('active');
                } else {
                    chip.classList.remove('active');
                }
            });
        }

        if (settings.timezone) {
            timezoneSelect.value = settings.timezone;
        }

        if (settings.currency) {
            currencySelect.value = settings.currency;
        }

        if (settings.dateFormat) {
            dateFormatSelect.value = settings.dateFormat;
        }

        if (settings.appointmentDuration) {
            durationSelect.value = settings.appointmentDuration;
        }


        if (typeof settings.allowAppointmentBooking === 'boolean') {
            allowBooking.checked = settings.allowAppointmentBooking;
        }

        if (typeof settings.sendAppointmentReminders === 'boolean') {
            sendReminders.checked = settings.sendAppointmentReminders;
        }

    } catch (error) {

        console.error(
            'Error loading operational settings:',
            error
        );
    }
});


settingsForm.addEventListener('keydown', (e) => {

    if (e.key === 'Enter' && e.target.tagName === 'SELECT') {
        e.preventDefault();
    }
});


[allowBooking, sendReminders].forEach(checkbox => {

    checkbox.addEventListener('change', () => {

        const item = checkbox.closest('.checkbox-item');

        if (checkbox.checked) {

            item.style.opacity = '1';

        } else {

            item.style.opacity = '0.75';
        }
    });
});

function resetToDefaults() {

    dayChips.forEach(chip => {

        const checkbox = chip.querySelector('input');

        const defaultDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

        checkbox.checked = defaultDays.includes(checkbox.value);

        chip.classList.toggle('active', checkbox.checked);
    });

    timezoneSelect.selectedIndex = 0;
    currencySelect.selectedIndex = 0;
    dateFormatSelect.selectedIndex = 0;
    durationSelect.selectedIndex = 0;


    allowBooking.checked = true;
    sendReminders.checked = true;

    localStorage.removeItem('swiftcareOperationalSettings');
}

console.log('SwiftCare Operational Settings Loaded Successfully');