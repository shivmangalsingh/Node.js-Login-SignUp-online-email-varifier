const { Router } = require('express');
const express = require('express');
const { login, signUp, isEmailExist, validator } = require('./db.js');
const { sendMail } = require('./nodeMail.js');
const bodyParser = require('body-parser');
const router = Router();
const app = express();
const bodyEncoder = app.use(bodyParser.urlencoded({ extended: false }))
router.post('/login', bodyEncoder, (req, res) => {
    login(req.body.email, req.body.password)
        .then(data => { res.send(data); })
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
            console.log(data);
            return sendMail(req.body.email)
        })
        .then(data => {
            console.log(data);
            res.send(data);
        })
        .catch((err) => { res.send(err); });

});
module.exports.router = router;