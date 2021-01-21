const moment = require('moment');
const model = require('../model/model.js');
const { delsuccess, delfail, paramerr, serverbusy, addsuccess, addfail, editsuccess, editfail, getfail } = require('../config/resmsg.json');

let controller = {
    console(req, res) { res.render('console'); },
    goods(req, res) { res.render('goods'); },
    cates(req, res) { res.render('cates'); },
    goods_add(req, res) { res.render('goods_add'); },
    goods_edit(req, res) { res.render('goods_edit'); },
    async getGoods(req, res) {
        // let sql1 = `select * from category order by cate_id asc`;
        // let category = {};
        // let cate = await model(sql1);
        // cate.forEach(v => {
        //     category[v.cate_id] = v.cate_name;
        // });
        let { page, limit } = req.query;
        let offset = (page - 1) * limit;
        let sql2 = `select * from goods limit ${offset}, ${limit}`;
        let sql3 = `select count(*) as count from goods`;
        let promise1 = model(sql2);
        let promise2 = model(sql3);
        let result = await Promise.all([promise1, promise2]);
        let data = {
            code: 0,
            msg: '',
            count: result[1][0].count,
            data: result[0]
        }
        res.json(data);
        // model(sql2).then(data => {
        // data.forEach(value => {
        //     value.category = category[value.category];
        // });
        //     res.json({ data });
        // }).catch(err => {
        //     res.json(serverbusy);
        // });
    },
    async delGoods(req, res) {
        let { goods_id } = req.body;
        if (!goods_id) return res.json(paramerr);
        let sql = `delete from goods where goods_id=${goods_id}`;
        let result = await model(sql);
        if (result.affectedRows) return res.json(delsuccess);
        res.json(delfail);
    },
    getCate(req, res) {
        let sql = `select * from category order by cate_id asc`;
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
    async cate_add(req, res) {
        let { cate_name } = req.body;
        let add_date = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
        let sql = `insert into category(cate_name,add_date) values('${cate_name}','${add_date}')`;
        let result = await model(sql);
        if (result.affectedRows) return res.json(addsuccess);
        res.json(addfail);
    },
    async cate_edit(req, res) {
        let { cate_id, cate_name } = req.body;
        let sql = `update category set cate_name='${cate_name}' where cate_id=${cate_id}`;
        let result = await model(sql);
        if (result.affectedRows) return res.json(editsuccess);
        res.json(editfail);
    },
    async cate_del(req, res) {
        let { cate_id } = req.body;
        if (!cate_id) return res.json(paramerr);
        let sql1 = `delete from category where cate_id=${cate_id}`;
        let result1 = await model(sql1);
        let sql2 = `delete from goods where category=${cate_id}`;
        let result2 = await model(sql2);
        if (result1.affectedRows && result2.affectedRows) return res.json(delsuccess);
        res.json(delfail);
    }
};

module.exports = controller;