
const express = require('express');
const app = express();
const router = express.Router();
const Sequelize = require('sequelize')
const mysql = require('mysql2')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('../../config');
const VerifyToken = require('./verifyToken');

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const User = require('../user/User');


router.post('/register', function (req, res) {

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    let name = req.body.name;
    let email = req.body.email;
    let password = hashedPassword;

    User.findOne({
        where: { email: email }
    }).then((user) => {
        if (user) {
            res.status(200).json({
                status: 0, message: 'User already exists'
            });
        }
        else {
            User.create({ name: name, email: email, password: password })
                .then((user) => {
                    // create a token
                    var token = jwt.sign({ name: user.name, id: user.id }, config.secret, {
                        expiresIn: 86400 // expires in 24 hours
                    });
                    res.status(200).send({ auth: true, token: token });
                }).catch((err) => {
                    res.status(500).send("There was a problem registering the user." + err);
                })

        }
        // { id: User._id }
    }).catch(() => {
        res.send("User created success");
    })

    // User.create({

    // },
    //     function (err, user) {
    //         if (err) return res.status(500).send("There was a problem registering the user.")
    //         // create a token
    //         var token = jwt.sign({ id: user._id }, config.secret, {
    //             expiresIn: 86400 // expires in 24 hours
    //         });
    //         res.status(200).send({ auth: true, token: token });
    //     });
});








router.get('/me', VerifyToken,  function (req, res) {

     User.findByPk(req.userId)
        .then((user) => {
            if (user) {
                res.status(200).json({
                    message: "Token valid", data: user
                });
                return res.send(data);
            }
            if (!user) res.status(404).json("No user found.");
        })
        .catch((error) => {
            //  res.status(500).send("There was a problem finding the user.");
        })

})

router.get('/', (req, res) => {
    res.status(200).json({
       
        message: 'Home page'
    });
})


module.exports = router;