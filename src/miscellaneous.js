require('./db/mongoose')
const User = require('./schema/users')
const Booking = require('./schema/booking')

//Pseudo code updating all the users to make them available
function updateUsers() {
    User.updateMany({
        available: false
    }, {
        available: true
    }).then((res) => {
        console.log(res)
    }).catch((e) => {
        console.log(e)
    })
}


//Pseudo code for making a random booking entry
function makeARandomBookingEntry() {
    let dateObj = new Date()
    const newBooking = {
        name: 'random',
        room: process.env.ROOM_NO,
        start_time: new Date(dateObj.getFullYear(), dateObj.getMonth + 1, dateObj.getDate(), 7, 0, 0, 0),
        end_time: new Date(dateObj.getFullYear(), dateObj.getMonth + 1, dateObj.getDate(), 9, 0, 0, 0)
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
}

function deleteAllBookingEntries() {
    Booking.deleteMany({}).then((res) => {
        console.log(res)
    }).catch((e) => {
        console.log(e)
    })
}

function createAUser(id) {
    let user = new User({
        userId: id,
        name: 'Virat Kohli',
        available: true
    })

    user.save().then(() => {
        console.log(user)
    }).catch((e) => {
        console.log(e)
    })
}

//Calling function (required)
makeARandomBookingEntry()
deleteAllBookingEntries()

updateUsers()
createAUser(process.env.USER_ID)