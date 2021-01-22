const moment = require('moment');
const model = require('../model/model.js');
const { delsuccess, delfail, paramerr, serverbusy, addsuccess, addfail, editsuccess, editfail, getfail } = require('../config/resmsg.json');

let controller = {
    cates(req, res) { res.render('cates'); },
    getCate(req, res) {
        let sql = `select * from category order by cate_id asc`;
        model(sql).then(data => {
            res.json({ data });
        }).catch(err => {
            res.json(serverbusy);
        });
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