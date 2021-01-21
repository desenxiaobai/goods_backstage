const express = require('express');
const router = express.Router();
const controller = require('../controller/controller.js');

router.get(/^\/$|^\/console$/, controller.console);
router.get('/goods', controller.goods);
router.get('/cates', controller.cates);
router.get('/goods_add', controller.goods_add);
router.get('/goods_edit', controller.goods_edit);


router.get('/getGoods', controller.getGoods);

router.post('/delGoods', controller.delGoods);

router.get('/getCate', controller.getCate);

router.post('/add_goods', controller.add_goods);

router.post('/edit_goods', controller.edit_goods);

router.get('/getOneGoods', controller.getOneGoods);

router.get('/cate_add', controller.cate_add);

router.get('/cate_edit', controller.cate_edit);

router.get('/cate_del', controller.cate_del);

module.exports = router;