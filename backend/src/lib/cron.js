import cron from "cron";
import http from "http";

const job = new cron.CronJob("*/14 * * * *", function () {
    http.get(process.env.BASE_URL, res => {
        if (res.statusCode !== 200) console.log("request sent seccessfully");
        else console.log("request failed", res.statusCode);
    })
        .on("error", err => {
            console.log("request failed", err);
        });
});

export default job