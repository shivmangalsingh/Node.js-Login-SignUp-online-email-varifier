const { Pool } = require('pg');
const utility = require('./utility.js');
const bcrypt = require('bcrypt');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'dcm123',
    port: 5432,
});

function signUp(email, password) {
    return new Promise((resolve, reject) => {
        const hashKey = utility.hashKeyGenerator();
        const hash = bcrypt.hashSync(password, 10);
        pool.query("INSERT INTO Account(email,password,hashkey) values($1,$2,$3)", [email, hash, hashKey], (err, res) => {
            if (err) {
                reject(err);
            } else resolve({
                data: "Your have successfully Signup! Please! check your email to verify!",
                key: hashKey
            });
        });

    });

}

function login(email, password) {
    return new Promise((resolve, reject) => {
        pool.query("SELECT verified,password FROM Account where email =$1 ", [email], (err, res) => {
            if (err) {
                reject(err);
            } else {
                if (res.rowCount) {
                    const value = bcrypt.compareSync(password, res.rows[0].password);
                    if (res.rows[0].verified && value) {
                        resolve("You have successfuly login to your Account!");
                    } else { reject("Wrong! email or password.Try again."); }
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
        const format = "/^[!@#$%^&*()_+\-=\[\]{};':|,.<>\/?]*$/";
        if (passowrd.length >= 8) {
            for (let i = 0; i < passowrd.length; i++) {
                for (let j = 0; j < format.length; j++) {
                    if (passowrd[i] === format[j]) {
                        resolve("Password is ok!");
                    }
                }
            }
            reject("Password doesn't meet the criteria.");

        } else {
            reject("Password doesn't meet the criteria.");
        }
    });
}

function makeUserVerified(key) {
    return new Promise((resolve, reject) => {
        pool.query("SELECT email FROM Account where hashkey =$1 ", [key], (err, res) => {
            if (err) {
                reject(err);
            } else {
                if (res.rowCount) {
                    console.log("Activating Account!");
                } else reject("Something is Wrong!");
            }
        });
        pool.query("UPDATE Account SET verified = $1 ,hashkey = $2 where hashkey =$3", [true, null, key], (err, res) => {
            if (err) {
                reject(err);
            } else {
                console.log("Done!");
                resolve('<h3>You have successfuly verified your Account!</h3>');
            }
        });
    });
}
module.exports.login = login;
module.exports.signUp = signUp;
module.exports.isEmailExist = isEmailExist;
module.exports.validator = validator;
module.exports.makeUserVerified = makeUserVerified;