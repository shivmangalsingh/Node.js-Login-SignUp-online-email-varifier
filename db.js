const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'dcm123',
    port: 5432,
});

function signUp(email, passowrd) {

    return new Promise((resolve, reject) => {

        pool.query("INSERT INTO Account(email,password) values($1,$2)", [email, passowrd], (err, res) => {
            if (err) {
                reject(err);
            } else resolve("Your have successfully Signup!");
        });

    });

}

function login(email, passowrd) {
    return new Promise((resolve, reject) => {
        pool.query("SELECT email,password FROM Account where email =$1 and password = $2", [email, passowrd], (err, res) => {
            if (err) {
                reject(err);
            } else {
                if (res.rowCount) {
                    console.log(res.rows[0]);
                    resolve("You have successfuly login to your Account!");
                } else { reject("Sorry! you did not have account"); }
            }
        });
    });
}

function isEmailExist(email) {
    return new Promise((resolve, reject) => {
        pool.query("SELECT email FROM Account where email =$1 ", [email], (err, res) => {
            if (err) {
                reject(err);
            } else {
                if (res.rowCount) {
                    reject("Email Already exist!");
                } else resolve("Email is ok!");
            }
        });
    });
}

function validator(passowrd) {
    return new Promise((resolve, reject) => {
        const format = /[!#@$%^&*_+())-=\[\]{};':"\\|,.<>\/?]+/;
        if (format.test(passowrd) && (passowrd.length >= 8)) {
            resolve("Password is ok!");
        } else {
            reject("Password doesn't meet the criteria.");
        }
    });
}
module.exports.login = login;
module.exports.signUp = signUp;
module.exports.isEmailExist = isEmailExist;
module.exports.validator = validator;