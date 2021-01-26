const model = require("../model/model.js");
const { serverbusy, loginfail, usernrepeat, registersuccess } = require('../config/resmsg.json');
const md5 = require('md5');
const { secret } = require('../config/secret.json');

let controller = {
    login(req, res) {
        if (req.session.userInfo) return res.redirect('/');
        res.render('login');
    },
    async checklogin(req, res) {
        let { username, password } = req.body;
        password = md5(`${password}${secret}`);
        let sql = `select * from users where username='${username}' and password='${password}'`;
        let data = await model(sql);
        if (data.length) {
            req.session.userInfo = data[0];
            res.json(data[0]);
            return;
        }
        res.json(loginfail);
    },
    logout(req, res) {
        req.session.destroy(err => {
            if (err) throw err;
        });
        res.send();
    },
    async registercheck(req, res) {
        let { username, password } = req.body;
        let sql = `select * from users where username='${username}'`;
        let data = await model(sql);
        if (data.length) return res.json(usernrepeat);
        password = md5(`${password}${secret}`);
        let sql1 = `insert into users(username,password) values('${username}','${password}')`;
        let result = await model(sql1);
        if (!result.affectedRows) return res.json(serverbusy);
        res.json(registersuccess);
    }
}
module.exports = controller;