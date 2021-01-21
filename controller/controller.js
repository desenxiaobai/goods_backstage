const moment = require('moment');
const model = require('../model/model.js');
const { delsuccess, delfail, paramerr, serverbusy, addgoodsucc, addgoodfail, editgoodsucc, editgoodfail, getfail } = require('../config/resmsg.json');

let controller = {
    console(req, res) { res.render('console'); },
    goods(req, res) { res.render('goods'); },
    cates(req, res) { res.render('cates'); },
    goods_add(req, res) { res.render('goods_add'); },
    goods_edit(req, res) { res.render('goods_edit'); },
    async getGoods(req, res) {
        let sql1 = `select * from category`;
        let category = {};
        let cate = await model(sql1);
        cate.forEach(v => {
            category[v.cate_id] = v.cate_name;
        });
        let sql2 = `select * from goods`;
        model(sql2).then(data => {
            data.forEach(value => {
                value.category = category[value.category];
            });
            res.json({ data });
        }).catch(err => {
            res.json(serverbusy);
        });
    },
    delGoods(req, res) {
        let { goods_id } = req.body;
        if (!goods_id) return res.json(paramerr);
        let sql = `delete from goods where goods_id=${goods_id}`;
        model(sql).then(result => {
            if (result.affectedRows) return res.json(delsuccess);
            res.json(delfail);
        });
    },
    getCate(req, res) {
        let sql = `select * from category`;
        model(sql).then(data => {
            res.json({ data });
        }).catch(err => {
            res.json(serverbusy);
        });
    },
    async add_goods(req, res) {
        let { goods_name, price, category, isShelf, depict } = req.body;
        let added_time = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
        let sql = `insert into goods(goods_name,price,depict,category,isShelf,added_time) 
            values('${goods_name}',${price},'${depict}',${category},${isShelf},'${added_time}')`;
        let result = await model(sql);
        if (result.affectedRows) return res.json(addgoodsucc);
        res.json(addgoodfail);
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
        if (result.affectedRows) return res.json(editgoodsucc);
        res.json(editgoodfail);
    },
    cate_add(req, res) {

    },
    cate_edit(req, res) {

    },
    cate_del(req, res) {

    }
};

module.exports = controller;