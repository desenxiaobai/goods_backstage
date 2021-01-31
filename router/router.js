const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const model = require('../model/model.js');
const goodsController = require('../controller/goodsController.js');
const cateController = require('../controller/cateController.js');
const userController = require('../controller/userController.js');

router.get(/^\/$|^\/index$/, (req, res) => {
    res.render('index');
});

router.get('/goods', goodsController.goods);
router.get('/goods_add', goodsController.goods_add);
router.get('/goods_edit', goodsController.goods_edit);
router.get('/getGoods', goodsController.getGoods);
router.post('/delGoods', goodsController.delGoods);
router.post('/add_goods', goodsController.add_goods);
router.post('/edit_goods', goodsController.edit_goods);
router.get('/getOneGoods', goodsController.getOneGoods);
router.post('/upload', upload.single('file'), goodsController.upload);
router.post('/updstatus', goodsController.updstatus);

router.get('/getCate', cateController.getCate);
router.get('/cates', cateController.cates);
router.post('/cate_add', cateController.cate_add);
router.post('/cate_edit', cateController.cate_edit);
router.post('/cate_del', cateController.cate_del);

router.get('/login', userController.login);
router.post('/checklogin', userController.checklogin);
router.get('/logout', userController.logout);
router.post('/registercheck', userController.registercheck);
router.post('/edit_user', userController.edit_user);
router.post('/edit_user_pwd', userController.edit_user_pwd);

router.get('/catecount', async (req, res) => {
    let sql = `select count(*) total,t2.cate_name,t1.category from goods t1 left join category t2 
                on t1.category=t2.cate_id group by t2.cate_id`;
    let data = await model(sql);
    res.json(data);
});

router.get('/goodscount', async (req, res) => {
    let sql = `select month(added_time) month,count(*) total from goods
                where year(added_time)=year(now())-1 group by month(added_time)`;
    let data = await model(sql);
    res.json(data);
});

module.exports = router;