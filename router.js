const { Router } = require('express');
const jwt = require('jsonwebtoken');
const express = require('express');
const { login, signUp, isEmailExist, validator, makeUserVerified } = require('./db.js');
const { sendMail } = require('./nodeMail.js');
const bodyParser = require('body-parser');
const router = Router();
const app = express();
const bodyEncoder = app.use(bodyParser.urlencoded({ extended: false }))
router.post('/login', bodyEncoder, (req, res) => {
    login(req.body.email, req.body.password)
        .then(data => {
            jwt.sign({ email: req.body.email, password: req.body.password }, process.env.SECRET_KEY, { expiresIn: '60s' }, (err, token) => {
                res.json({ data, token });
            })
        })
        .catch(err => { res.send(err); });
});
router.post('/signUp', bodyEncoder, (req, res) => {
    validator(req.body.password)
        .then((data) => {
            console.log(data);
            return isEmailExist(req.body.email)
        })
        .then((data) => {
            console.log(data);
            return signUp(req.body.email, req.body.password);
        })
        .then(data => {
            res.send(data.data);
            return sendMail(req.body.email, data.key)
        })
        .then(data => {
            console.log(data);
        })
        .catch((err) => { res.send(err); });

});
router.post('/resource', verifyToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
        if (err) res.send("Something is wrong! Login again!");
        else {
            res.json({
                message: 'I have access to  the Resource',
                authData
            });
        }
    });
});
router.get('/verifying/:key', (req, res) => {
    const key = req.params.key;
    makeUserVerified(key)
        .then(data => { res.send(data); })
        .catch(err => { res.send(err); });
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        req.token = bearerHeader;
        next();
    } else {
        res.json({ message: "You are not allowed" });
    }
}
module.exports.router = router;