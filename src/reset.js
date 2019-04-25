require ('./db/mongoose')
const User = require ('./schema/users')

User.updateMany ({ available: false }, { available: true }).then ((res) => {
    console.log (res)
}).catch ((e) => {
    console.log (e)
})