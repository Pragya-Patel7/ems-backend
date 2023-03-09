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

    static nextDay() {
        let date = new Date(finalDate.getTime() + 86400000 + offset).toISOString().slice(0, 10);
        // date = date + " 00:00:01";
        return date;
    }
	
    static nextDayQuery() {
        let date = new Date(finalDate.getTime() + 86400000 + offset).toISOString().slice(0, 10);
        date = date + " 00:00:01";
        return date;
    }
}

module.exports = TimeUtils;