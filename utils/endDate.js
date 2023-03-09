const TimeUtils = require("./timeUtils");

const setEndDate = (data) => {
    if(data.duration_id === "1")    // Daily
        data.end_date = TimeUtils.nextDay(data.start_date);

    if (data.duration_id === "4")    // Yearly
        data.end_date = TimeUtils.setOneYear();

    return data;
}

module.exports = setEndDate;