const fs = require('fs');
const path = require('path');
const model = require('../model/model.js');
const { delsuccess, delfail, paramerr, addsuccess, addfail, editsuccess, editfail, getfail, operatesuccess, operatefail }
    = require('../config/resmsg.json');

let controller = {
    goods(req, res) { res.render('goods'); },
    goods_add(req, res) { res.render('goods_add'); },
    goods_edit(req, res) { res.render('goods_edit'); },

    async getGoods(req, res) {
        let { page, limit, goods_title, status } = req.query;
        let where = `where 1`;
        goods_title && (where += ` and goods_title like '%${goods_title}%'`);
        status && (where += ` and status=${status}`);
        let offset = (page - 1) * limit;
        let sql1 = `select t1.*,t2.cate_name from goods t1 left join category t2 on t1.category=t2.cate_id 
            ${where} order by goods_id desc limit ${offset},${limit}`;
        let sql2 = `select count(*) as count from goods ${where}`;
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
        let { goods_title, detailspic, price, category, depict } = req.body;
        let sql = `insert into goods(goods_title,detailspic,price,depict,category,added_time) 
            values('${goods_title}','${detailspic}',${price},'${depict}',${category},now())`;
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
        let { goods_id, detailspic, goods_title, price, category, depict, status } = req.body;
        status = status == 3 ? 2 : status;
        let sql = `update goods set goods_title='${goods_title}',detailspic='${detailspic}',price=${price}, 
            depict='${depict}',category=${category},status=${status} where goods_id=${goods_id}`;
        let result = await model(sql);
        if (result.affectedRows) return res.json(editsuccess);
        res.json(editfail);
    },
    upload(req, res) {
        if (!req.file) return res.json({ message: '没有上传文件', src: null });
        let oldFile = req.body.oldFile;
        let { originalname, destination, filename } = req.file;
        let ext = originalname.substring(originalname.lastIndexOf('.'));
        let oldPath = `${destination}${filename}`;
        let newPath = `${oldPath}${ext}`;
        fs.rename(oldPath, newPath, err => {
            if (err) throw err;
            // oldFile && fs.unlinkSync(path.join(__dirname, oldFile));
            res.json({ message: '上传成功', src: newPath });
        });
    },
    async updstatus(req, res) {
        let { goods_id, status } = req.body;
        let sql = `update goods set status=${status} where goods_id=${goods_id}`;
        let result = await model(sql);
        if (result.affectedRows) return res.json(operatesuccess);
        res.json(operatefail);
    }
};

module.exports = controller;