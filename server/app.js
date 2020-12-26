const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const PORT = 5000
const{MONGOURI} = require('./keys')

mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected',()=>{
    console.log('connected to mongooes yaah')
})

mongoose.connection.on('error',(err)=>{
    console.log('error connecting',err)
})

require('./models/user')
require('./models/post')
app.use(cors())
app.use(express.json())                     // pass incoming request to json
app.use(require('./routes/auth'))           //register auth route
app.use(require('./routes/post'))           //register post route
app.use(require('./routes/user'))           //register user route

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})