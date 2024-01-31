

function getOffset(callback) {
    var diff_from_server = 0;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://worldtimeapi.org/api/ip', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            const server_time = new Date(Date.parse(data.datetime));
            const local_time = new Date();
            diff_from_server = server_time.getTime() - local_time.getTime();
            callback(diff_from_server);
        } else if (xhr.readyState === 4) {
            console.log('Error getting time from server.');
            callback(diff_from_server);
        }
    };
    xhr.send();
}

class JSNtp extends Date {
    constructor() {
        super();
        getOffset((response) => {
            console.log("Response is " + response);
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

        return format.replace(/%Y/g, year)
                     .replace(/%m/g, month)
                     .replace(/%d/g, day)
                     .replace(/%H/g, hours)
                     .replace(/%M/g, minutes)
                     .replace(/%S/g, seconds)
                     .replace(/%f/g, milliseconds)
                     .replace(/%z/g, timezone_formatted)
                     .replace(/%s/g, Math.floor(date.getTime() / 1000))
                     .replace(/%t/g, date.getTime())
                     .replace(/%D/g, date.getDay())
                     .replace(/%j/g, Math.floor((date.getTime() - (new Date(date.getFullYear(), 0, 1)).getTime()) / 86400000) + 1)
                     ;
    }
}

console.log((new JSNtp()).fmt("%Y-%m-%d %H:%M:%S"));
