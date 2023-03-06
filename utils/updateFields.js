const updateFields = (data) => {
    if (data.is_verified == "true" || data.is_verified == "1" || data.is_verified === true)
        data.is_verified = 1;

    if (data.is_verified == "false" || data.is_verified == "0" || data.is_verified === false)
        data.is_verified = 0;

    if (data.status == "true" || data.status == "1" || data.status === true)
        data.status = 1;

    if (data.status == "false" || data.status == "0" || data.status === false)
        data.status = 0;

    return data;
};

module.exports = updateFields;