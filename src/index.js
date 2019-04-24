const express = require ('express')
const app = express ()

app.post ('http://roombooking.surrey.sfu.ca/edit_entry_handler.php', (req, res) => {
    app.set ('Cookie', '_ga=GA1.2.316387562.1552265317; _gid=GA1.2.1030685302.1552265317; FAS_MRBS=rmittal')
    app.set ('Referer', 'http://roombooking.surrey.sfu.ca/edit_entry.php?area=1&room=1&hour=7&minute=00&year=2019&month=4&day=25')
    app.set ('Content-Type', 'application/x-www-form-urlencoded')

    res.send ({
        name: 'Room booking',
        description: 'Study room for friends',
        start_day: 25,
        start_month:,
        start_year:,
        start_seconds:,
        end_day:,
        end_month:,
        end_year:,
        end_seconds:,
        area:1,
        rooms:[1],
        type:'E',
        returl:'http://roombooking.surrey.sfu.ca/day.php?year={{year}}&month={{month}}&day={{day}}&area=1&room=1',
        create_by:'rmittal',
        save_button:'Save'
    })
})