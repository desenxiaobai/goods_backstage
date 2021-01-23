const express = require('express');
const artTemplate = require('art-template');
const express_template = require('express-art-template');
const app = express();
const router = require('./router/router.js');

app.set('views', __dirname + '/views/');
app.engine('html', express_template);
app.set('view engine', 'html');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(router);

app.listen(4000, () => console.log('Server is running at port 4000!'));