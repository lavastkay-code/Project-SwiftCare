document.addEventListener('DOMContentLoaded', () => {

    const adminData = JSON.parse(
        localStorage.getItem('swiftcareAdminAccount') || '{}'
    );

    if (adminData.clinicName) {
        document.getElementById('reviewClinicName').textContent = adminData.clinicName;
    }

    if (adminData.email) {
        document.getElementById('reviewEmail').textContent = adminData.email;
    }

    if (adminData.phone) {
        document.getElementById('reviewPhone').textContent = adminData.phone;
    }

    if (adminData.state) {
        document.getElementById('reviewState').textContent = adminData.state;
    }


    const clinicProfile = JSON.parse(
        localStorage.getItem('swiftcareClinicProfile') || '{}'
    );

    if (clinicProfile.clinicType) {
        document.getElementById('reviewClinicType').textContent = clinicProfile.clinicType;
    }

    if (clinicProfile.addressLine1) {
        document.getElementById('reviewAddress').textContent = clinicProfile.addressLine1;
    }

    const operational = JSON.parse(
        localStorage.getItem('swiftcareOperationalSettings') || '{}'
    );

    if (operational.workingDays?.length) {
        document.getElementById('reviewDays').textContent =
            operational.workingDays.join(', ');
    }

    if (operational.timezone) {
        document.getElementById('reviewTimezone').textContent =
            operational.timezone;
    }

    if (operational.currency) {
        document.getElementById('reviewCurrency').textContent =
            operational.currency;
    }

    if (operational.dateFormat) {
        document.getElementById('reviewDateFormat').textContent =
            operational.dateFormat;
    }

    if (operational.appointmentDuration) {
        document.getElementById('reviewDuration').textContent =
            operational.appointmentDuration;
    }

    document.getElementById('reviewBooking').textContent =
        operational.allowAppointmentBooking ? 'Enabled' : 'Disabled';

    document.getElementById('reviewReminders').textContent =
        operational.sendAppointmentReminders ? 'Enabled' : 'Disabled';
})