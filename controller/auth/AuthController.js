
const express = require('express');
const app = express();
const router = express.Router();
const Sequelize = require('sequelize')
const mysql = require('mysql2')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('../../config');
const VerifyToken = require('./verifyToken');
const JwtConfig = require('../../config/jwt-config');


app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const User = require('../user/User');


router.post('/register', function (req, res) {

    var hashedPassword = bcrypt.hashSync(req.body.password, 10);

    let name = req.body.name;
    let email = req.body.email;
    let password = hashedPassword;
    let status = req.body.status;

    User.findOne({
        where: { email: email }
    }).then((user) => {
        if (user) {
            res.status(200).json({
                status: 0, message: 'User already exists'
            });
        }
        else {
            User.create({ name: name, email: email, password: password, status: status })
                .then((response) => {
                    res.status(200).json({
                        status: 1, message: "User is registred success"
                    });
                }).catch((err) => {
                    res.status(500).json({ status: 0, data: err });
                });
        }
    }).catch((err) => {
        console.log(err);
    });
})


//     }

//     }).catch (() => {
//     res.send("User created success");
// })

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




router.post('/login', (req, res) => {
    User.findOne({
        where: { email: req.body.email }
    }).then((user) => {
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {

                let usertoken = jwt.sign({
                    email: user.email,
                    id: user.id
                },
                    JwtConfig.secret, {
                    expiresIn: JwtConfig.expiresIn
                }
                )


                res.status(200).json({
                    status: 1, message: "User logged in success",
                    token:usertoken
                });
            }

            else {
                res.status(500).json({
                    status: 0, message: "Password not matched"
                });
            }
        }
        else {
            res.status(500).json({
                status: 0, message: "User not exist with this email"
            });
        }
    }).catch((err) => {
        console.log(err);
    })
})


router.post('/validate', (req, res) => {
    // console.log(req.headers);
    let usertoken = req.headers["authorization"];

    if (usertoken) {
        jwt.verify(usertoken, JwtConfig.secret, (err, decoded) => {
            if (err) {
                res.status(500).json({ status: 0, message: "Invalid token", data: err })
            }
            else {
                res.status(200).json({ status: 1, message: "token is NOW VALID", data: decoded });
            }
        })
    }
    else {
        res.status(500).json({
            status: 0, message: "pl provide token value for authentication"
        });
    }
})

// router.get('/me', VerifyToken, function (req, res) {

//     User.findByPk(req.userId)
//         .then((user) => {
//             if (user) {
//                 res.status(200).json({
//                     message: "Token valid", data: user
//                 });
//                 return res.send(data);
//             }
//             if (!user) res.status(404).json("No user found.");
//         })
//         .catch((error) => {
//             //  res.status(500).send("There was a problem finding the user.");
//         })

// })

router.get('/', (req, res) => {
    res.status(200).json({

        message: 'Home page'
    });
})


module.exports = router;