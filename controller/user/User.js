const express = require('express')
const Sequelize = require('sequelize')
// const mysql = require('mysql2')
// const JWT = require('jsonwebtoken')
// const bcrypt = require('bcrypt')
// const express = require('express')
const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const sequelize = new Sequelize('experiment', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'

});
sequelize.authenticate()
    .then((data) => {
        console.log("DB Connected");
    }).catch((err) => {
        console.log(err);
    })

const User = sequelize.define('Myauth', {

    id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER

    },
    name: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    password: {
        type: Sequelize.STRING(150),
        allowNull: false
    },
    status:{
        type:Sequelize.INTEGER,
        defaultValue:1
    }
    

}, {
    timestamps: false,
    modelName: 'User'
});

User.sync();

module.exports=User;