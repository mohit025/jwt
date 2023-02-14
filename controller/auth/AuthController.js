
const express = require('express');
const app = express();
const router = express.Router();
const Sequelize = require('sequelize')
const mysql = require('mysql2')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('../../config');
// const VerifyToken = require('./VerifyToken');

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
                    var token = jwt.sign({ name: user.name , id:user.id}, config.secret, {
                        expiresIn: 86400 // expires in 24 hours
                    });
                    res.status(200).send({ auth: true, token: token });
                }).catch((err) => {
                    res.status(500).send("There was a problem registering the user." + err);
                })

        }
        // { id: User._id }
    }).catch(()=>{
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







router.get('/me', function (req, res) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        res.status(200).send(decoded);
    });
});



router.get('/', (req, res) => {
    res.status(200).json({
        status: 1,
        message: 'Home page'
    });
})


module.exports = router;