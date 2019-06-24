const request = require("request");
require("./db/mongoose");
const Booking = require("./schema/booking");
const User = require("./schema/users");
const express = require("express");
const path = require("path");
var cron = require("cron");

const server = express();
const port = process.env.PORT;

server.use(express.static(path.join(__dirname, 'public'), {
    extensions: ['html']
}));

server.use(express.static(path.join(__dirname, "..")));

server.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

server.get('/', (req, res) => {
    res.send('roombookings');
})

server.get("/getEvents", async (req, res) => {
    const events = await Booking.find({});
    res.send(events);
});

function postBookingRequest() {
    let dateObj = new Date(Date.now() + 12096e5);
    let day = dateObj.getDate();
    let month = dateObj.getMonth() + 1;
    let year = dateObj.getFullYear();
    let currentHour = dateObj.getHours();
    let start_seconds = currentHour * 3600;
    let end_seconds = start_seconds + ((currentHour == 21) ? 1800 : 7200);
    let minute = (currentHour == 21) ? 30 : 0;
    let endHour = (currentHour == 21) ? 21 : (currentHour + 2);
    let userID;
    let area = 1;

    User.findOne({
            available: true
        })
        .then(user => {
            if (!user) {
                throw new Error('No user available')
            }
            userID = user.userId;
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
                area,
                //While changing the room number, remember to change it in the returl too.
                rooms: [10],
                type: "E",
                returl: `http://roombooking.surrey.sfu.ca/day.php?year=${year}&month=${month}&day=${day}&area=${area}&room=10`,
                create_by: userID,
                save_button: "Save"
            };
            request({
                    headers: {
                        Cookie: `_ga=GA1.2.316387562.1552265317; _gid=GA1.2.1030685302.1552265317; FAS_MRBS=${userID}`,
                        Referer: `http://roombooking.surrey.sfu.ca/edit_entry.php?area=${area}&room=10&hour=${currentHour}&minute=${minute}&year=${year}&month=${month}&day=${day}`,
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
                        user.available = false;
                        user.save().then((res) => {
                            console.log(res)
                        }).catch((e) => {
                            console.log(e)
                        })

                        const newBooking = {
                            name: userID,
                            room: process.env.ROOM_NO,
                            start_time: new Date(year, month, day, currentHour, 0, 0, 0),
                            end_time: new Date(year, month, day, endHour, minute, 0, 0)
                        };

                        const bookingEntry = new Booking(newBooking);
                        bookingEntry
                            .save()
                            .then(() => {
                                console.log(bookingEntry);
                            })
                            .catch(e => {
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

new CronJob("0 15 7-21/2 * * *", function () {
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

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});