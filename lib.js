function getOffset(callback) {
    var diff_from_server = 0;
    fetch('https://worldtimeapi.org/api/ip')
        .then(response => response.json())
        .then(data => {
            const server_time = new Date(Date.parse(data.datetime));
            const local_time = new Date();
            diff_from_server = server_time.getTime() - local_time.getTime();
            callback(diff_from_server);
        })
        .catch(error => {
            console.log('Error getting time from server.');
            callback(diff_from_server);
        });
}

class JSNtp extends Date {
    constructor() {
        super();
        getOffset((response) => {
            let date_obj = new Date((new Date()).getTime() + response);
            this.setMilliseconds(date_obj.getMilliseconds());
        });
    }

    fmt(format) {
        const date = this;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
        const timezone = date.getTimezoneOffset();
        const timezone_formatted = (timezone < 0 ? '+' : '-') + String(Math.abs(timezone) / 60).padStart(2, '0') + ':' + String(Math.abs(timezone) % 60).padStart(2, '0');

        // compiled from strftime.org's list, based on Python. Additionally has support for %.<n>f for milliseconds
        return format.replace(/%a/g, ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()])
            .replace(/%A/g, ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()])
            .replace(/%w/g, String(date.getDay()))
            .replace(/%d/g, day)
            .replace(/%\-d/, date.getDate())
            .replace(/%b/g, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', "Nov", 'Dec'][date.getMonth()])
            .replace(/%B/g, ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', "November", 'December'][date.getMonth()])
            .replace(/%m/g, month)
            .replace(/%\-m/g, date.getMonth() + 1)
            .replace(/%y/g, String(year).slice(-2))
            .replace(/%Y/g, year)
            .replace(/%H/g, hours)
            .replace(/%\-H/g, date.getHours())
            .replace(/%I/g, String(date.getHours() % 12 || 12))
            .replace(/%\-I/g, date.getHours() % 12 || 12)
            .replace(/%p/g, date.getHours() < 12 ? 'AM' : 'PM')
            .replace(/%M/g, minutes)
            .replace(/%\-M/g, date.getMinutes())
            .replace(/%S/g, seconds)
            .replace(/%\-S/g, date.getSeconds())
            .replace(/%f/g, milliseconds)
            .replace(/%z/g, timezone)
            .replace(/%Z/g, timezone_formatted)
            .replace(/%j/g, String(Math.ceil((date - new Date(date.getFullYear(), 0, 1)) / 86400000)).padStart(3, '0'))
            .replace(/%\-j/g, Math.ceil((date - new Date(date.getFullYear(), 0, 1)) / 86400000))
            .replace(/%U/g, String(Math.ceil((date - new Date(date.getFullYear(), 0, 1)) / 86400000 / 7)).padStart(2, '0'))
            .replace(/%\-U/g, Math.ceil((date - new Date(date.getFullYear(), 0, 1)) / 86400000 / 7))
            .replace(/%W/g, String(Math.ceil((date - new Date(date.getFullYear(), 0, 1)) / 86400000 / 7)).padStart(2, '0'))
            .replace(/%\-W/g, Math.ceil((date - new Date(date.getFullYear(), 0, 1)) / 86400000 / 7))
            .replace(/%c/g, date.toLocaleString())
            .replace(/%x/g, date.toLocaleDateString())
            .replace(/%X/g, date.toLocaleTimeString())
            .replace(/%\.(\d+)f/g, (match, p1) => "." + milliseconds.slice(0, p1))
            .replace(/%%/g, '%');
    }
}

console.log((new JSNtp()).fmt("%Y-%m-%d %H:%M:%S%.3f"));