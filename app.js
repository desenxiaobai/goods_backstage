const express = require('express');
const artTemplate = require('art-template');
const express_template = require('express-art-template');
const app = express();
const router = require('./router/router.js');
const session = require('express-session');

app.set('views', __dirname + '/views/');
app.engine('html', express_template);
app.set('view engine', 'html');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/uploads'));

let options = {
    name: "SESSIONID",
    secret: "LKSD%$&*LI#",
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 60000 * 20
    }
};
app.use(session(options));

app.use((req, res, next) => {
    let path = req.path.toLowerCase();
    let nocheck = ['/login', '/checklogin', '/registercheck'];
    if (nocheck.includes(path)) return next();
    if (req.session.userInfo) return next();
    res.redirect('/login');
});

app.use(router);

app.listen(4000, () => console.log('Server is running at port 4000!'));