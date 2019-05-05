const request = require ('request')
require ('./db/mongoose')
const Booking = require ('./schema/booking')
const User = require ('./schema/users')

let day = 15
let month = 5
let year = 2019
let start_seconds = 32400 + 7200
let end_seconds = 32400 + 3600 + 3600 + 7200
let userID
let currentHour = start_seconds/3600

User.findOne ({ available: true }).then((user) => {
    userID = user.userId
    user.available = false
    console.log (userID)
    return user.save()
}).then (() => {
    var formData = {
        name: 'Room booking',
        description: 'Study room for friends',
        start_day: day,
        start_month: month,
        start_year: year,
        start_seconds,
        end_day: day,
        end_month: month,
        end_year: year,
        end_seconds,
        area:1,
        rooms:[1],
        type:'E',
        returl: `http://roombooking.surrey.sfu.ca/day.php?year=${year}&month=${month}&day=${day}&area=1&room=1`,
        create_by: userID,
        save_button:'Save'
    }
    request ({
        headers: {
            'Cookie': `_ga=GA1.2.316387562.1552265317; _gid=GA1.2.1030685302.1552265317; FAS_MRBS=${userID}`,
            'Referer': `http://roombooking.surrey.sfu.ca/edit_entry.php?area=1&room=1&hour=${currentHour}&minute=00&year=${year}&month=${month}&day=${day}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        url: 'http://roombooking.surrey.sfu.ca/edit_entry_handler.php',
        // formData,
        method: 'POST'
    }, (err, res, body) => {
        console.log ('i am consoling')
        if (res.statusCode === 302) {
            console.log ('Booking confirmed')
            const newBooking = {
                name: userID,
                room: 3202,
                time: new Date()
            }
    
            const bookingEntry = new Booking (newBooking)
            bookingEntry.save().then (() => {
                console.log ('coming here')
                console.log (bookingEntry)
            }).catch ((e) => {
                console.log ('not coming here')
                console.log (e)
            })
        }
        else {
            console.log ('Could not book the room')
        }
    })
}).catch (() => {
    console.log ('No user available')
})

// userID = 'rmittal'

// console.log (formData)

// var cron = require('cron')
// var CronJob = cron.CronJob;
// new CronJob('* * * * * *', function() {
//   console.log('You will see this message every second');
// }).start();

// console.log(cron)
