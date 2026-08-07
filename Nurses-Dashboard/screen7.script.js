document.addEventListener("DOMContentLoaded", () => {

    const notificationClose =
        document.getElementById("notificationClose");

    const notification =
        document.getElementById("triageNotification");

    if (notificationClose && notification) {
        notificationClose.addEventListener("click", () => {
            notification.remove();
        });
    }

});
