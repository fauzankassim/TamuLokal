const { putNotificationIsRead, getNotification }  = require('../services/notifications');

const GetNotification = async (req, res) => {
    try {
        const { user_id } = req.query;
        const notification = await getNotification(user_id);
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).send(error);
    }
}

const PutNotificationIsRead = async (req, res) => {
    try {
        const id = req.params.id;
        const notification = await putNotificationIsRead(id);
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = {
    PutNotificationIsRead,
    GetNotification
}