const Notification =
    require("../models/Notification");

const createNotification = async ({
    user,
    complaint,
    message,
    type
}) => {
    await Notification.create({
        user,
        complaint,
        message,
        type
    });
};

module.exports = createNotification;