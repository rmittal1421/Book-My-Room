const request = require("request");
require("./db/mongoose");
const Booking = require("./schema/booking");
const User = require("./schema/users");
const express = require("express");
const path = require("path");
var cron = require("cron");

const server = express();

server.use(express.static(path.join(__dirname, "public")));
server.use(express.static(path.join(__dirname, "..")));

server.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

server.get("/getEvents", async (req, res) => {
    const events = await Booking.find({});
    res.send(events);
});

function postBookingRequest() {
    let dateObj = new Date();
    let day = dateObj.getDate();
    let month = dateObj.getMonth();
    let year = dateObj.getFullYear();
    let start_seconds = dateObj.getHours() * 3600;
    let end_seconds = start_seconds + 7200;
    let userID;
    let currentHour = dateObj.getHours();

    // let day = 30;
    // let month = 5;
    // let year = 2019;
    // let start_seconds = 11 * 3600;
    // let end_seconds = start_seconds + 7200;
    // let userID;
    // let currentHour = start_seconds / 3600;

    User.findOne({
            available: true
        })
        .then(user => {
            userID = user.userId;
            // user.available = false
            console.log(userID);
            var formData = {
                name: "Room booking",
                description: "Study room for friends",
                start_day: day,
                start_month: month,
                start_year: year,
                start_seconds,
                end_day: day,
                end_month: month,
                end_year: year,
                end_seconds,
                area: 1,
                rooms: [1],
                type: "E",
                returl: `http://roombooking.surrey.sfu.ca/day.php?year=${year}&month=${month}&day=${day}&area=1&room=1`,
                create_by: userID,
                save_button: "Save"
            };
            request({
                    headers: {
                        Cookie: `_ga=GA1.2.316387562.1552265317; _gid=GA1.2.1030685302.1552265317; FAS_MRBS=${userID}`,
                        Referer: `http://roombooking.surrey.sfu.ca/edit_entry.php?area=1&room=1&hour=${currentHour}&minute=00&year=${year}&month=${month}&day=${day}`,
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    url: "http://roombooking.surrey.sfu.ca/edit_entry_handler.php",
                    formData,
                    method: "POST"
                },
                (err, res, body) => {
                    if (err) {
                        throw Error(err);
                    } else if (res.statusCode === 302) {
                        console.log("Booking confirmed");
                        const newBooking = {
                            name: userID,
                            room: 3202,
                            start_time: new Date(year, month - 1, day, currentHour, 0, 0, 0),
                            end_time: new Date(year, month - 1, day, currentHour + 2, 0, 0, 0)
                        };

                        const bookingEntry = new Booking(newBooking);
                        bookingEntry
                            .save()
                            .then(() => {
                                console.log("coming here");
                                console.log(bookingEntry);
                            })
                            .catch(e => {
                                console.log("not coming here");
                                console.log(e);
                            });
                    } else {
                        console.log("Could not book the room");
                    }
                }
            );
        })
        .catch(e => {
            console.log(e);
        });
}

var CronJob = cron.CronJob;

new CronJob("* * 7-19/2 * * *", function () {
    postBookingRequest();
}).start();

new CronJob("0 0 0 * * *", () => {
    User.updateMany({
        available: false
    }, {
        available: true
    }).then((res) => {
        console.log(res)
    }).catch((e) => {
        console.log(e)
    })

    Booking.remove({
        start_time: {
            $lt: new Date()
        }
    }).then((res) => {
        console.log(res)
    }).catch((e) => {
        console.log(e)
    })
}).start();

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});