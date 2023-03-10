let finalDate = new Date();
const ISToffSet = 330; //IST is 5:30; i.e. 60*5+30 = 330 in minutes 
const offset = ISToffSet * 60 * 1000;
const ISTTime = new Date(finalDate.getTime() + offset);

class TimeUtils {
    static getDate() {
        const date = ISTTime.toISOString().slice(0, 10);
        return date;
    }

    static getTime() {
        const time = ISTTime.toISOString().slice(11, 19);
        return time;
    }

    static date() {
        const date = this.getDate() + " " + this.getTime();
        return date;
    }

    static tomorrow() {
        const date = new Date(ISTTime.getTime() + 86400000 + offset).toISOString().slice(0, 10);
        return date;
    }

    static nextDay(start_date) {
        const startDate = new Date(start_date);
        let date = new Date(startDate.getTime() + 86400000 + offset).toISOString().slice(0, 10);
        // date = date + " 00:00:00";
        return date;
    }

    static nextDayQuery() {
        let date = new Date(finalDate.getTime() + 86400000 + offset).toISOString().slice(0, 10);
        // date = date + " 00:00:01";
        return date;
    }
	
    static nextDayQuery() {
        let date = new Date(finalDate.getTime() + 86400000 + offset).toISOString().slice(0, 10);
        date = date + " 00:00:01";
        return date;
    }

    static setOneYear(start_date) {
        // console.log(object);
        const startDate = new Date(start_date);
        const nextYearDate = startDate.setFullYear(finalDate.getFullYear() + 1);
        const year = new Date(nextYearDate).toISOString().slice(0, 10);
        return year;
    }

    static oneYearQuery() {
        const nextYearDate = ISTTime.setFullYear(finalDate.getFullYear() + 1);
        let year = new Date(nextYearDate).toISOString().slice(0, 10);
        year = year + "00:00:01";
        return year;
    }
}

module.exports = TimeUtils;