const moment = require('moment');
const model = require('../model/model.js');
const { delsuccess, delfail, paramerr, addsuccess, addfail, editsuccess, editfail, getfail } = require('../config/resmsg.json');

let controller = {
    console(req, res) { res.render('console'); },
    goods(req, res) { res.render('goods'); },
    goods_add(req, res) { res.render('goods_add'); },
    goods_edit(req, res) { res.render('goods_edit'); },
    async getGoods(req, res) {
        let { page, limit } = req.query;
        let offset = (page - 1) * limit;
        let sql1 = `select * from goods order by goods_id desc limit ${offset}, ${limit}`;
        let sql2 = `select count(*) as count from goods`;
        let promise1 = model(sql1);
        let promise2 = model(sql2);
        let result = await Promise.all([promise1, promise2]);
        let data = {
            code: 0,
            msg: '',
            count: result[1][0].count,
            data: result[0]
        }
        res.json(data);
    },
    async delGoods(req, res) {
        let { goods_id } = req.body;
        if (!goods_id) return res.json(paramerr);
        let sql = `delete from goods where goods_id=${goods_id}`;
        let result = await model(sql);
        if (result.affectedRows) return res.json(delsuccess);
        res.json(delfail);
    },
    async add_goods(req, res) {
        let { goods_name, price, category, isShelf, depict } = req.body;
        let added_time = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
        let sql = `insert into goods(goods_name,price,depict,category,isShelf,added_time) 
            values('${goods_name}',${price},'${depict}',${category},${isShelf},'${added_time}')`;
        let result = await model(sql);
        if (result.affectedRows) return res.json(addsuccess);
        res.json(addfail);
    },
    async getOneGoods(req, res) {
        let { goods_id } = req.query;
        if (!goods_id) return res.json(paramerr);
        let sql = `select * from goods where goods_id=${goods_id}`;
        let data = await model(sql);
        if (data.length) return res.json(data[0]);
        res.json(getfail);
    },
    async edit_goods(req, res) {
        let { goods_id, goods_name, price, category, isShelf, depict } = req.body;
        let sql = `update goods set goods_name='${goods_name}',price=${price},depict='${depict}',
            category=${category},isShelf=${isShelf} where goods_id=${goods_id}`;
        let result = await model(sql);
        if (result.affectedRows) return res.json(editsuccess);
        res.json(editfail);
    },
};

module.exports = controller;