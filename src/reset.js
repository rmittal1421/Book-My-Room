require('./db/mongoose')
const User = require('./schema/users')
const Bookings = require('./schema/booking')

// User.updateMany ({ available: false }, { available: true }).then ((res) => {
//     console.log (res)
// }).catch ((e) => {
//     console.log (e)
// })

console.log('coming here')

// Bookings.find({
//     start_time: {
//         $lt: new Date(2019, 6, 1, 0, 0, 0, 0)
//     }
// }).then((res) => {
//     console.log(res)
// }).catch((e) => {
//     console.log(e)
// })

Bookings.remove({
    start_time: {
        $lt: new Date(2019, 5, 1, 0, 0, 0, 0)
    }
}).then((res) => {
    console.log(res)
}).catch((e) => {
    console.log(e)
})