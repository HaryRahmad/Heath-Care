const express = require('express')
const app = express()
const port = 3000
var session = require('express-session')


app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret:'secrettt',
    resave: false,
    saveUninitialized:false,
    cookie:{secure:false}
    }))
    
app.use('/',require("./router/routers.js"))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



module.exports = app