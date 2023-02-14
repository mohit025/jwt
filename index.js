const express = require('express')
const app = express()
const Sequelize = require('sequelize')
const mysql = require('mysql2')
const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt')
// const express = require('express')
const User=require('./controller/user/User');
const AuthController= require('./controller/auth/AuthController');

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.use('/api/auth', AuthController);






app.listen(8081, () => {
    console.log('server running on 8081');
})


















