const ComplaintActivity =
    require("../models/ComplaintActivity");

const createComplaintActivity = async ({
    complaint,
    action,
    performedBy,
    role
}) => {
    await ComplaintActivity.create({
        complaint,
        action,
        performedBy,
        role
    });
};

module.exports = createComplaintActivity;