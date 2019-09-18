var express = require('express');
var bodyParser = require("body-parser");
var session = require('cookie-session');
var fx = require('money');
var ox = require('open-exchange-rates');

var app = express();

ox.set({ app_id: '7d228c4bef43404c9b11233ce3bb1178'});
fx.settings = {from: "USD", to: "EUR"};

app.set('view engine', 'ejs');

//APP USE
app.use('/stylesheets', express.static('stylesheets'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    name: 'session',
    keys: ['dfsfdsfsfds'],
    maxAge: 24 * 60 * 60 * 1000,// 24 hours
    result: 'undefined'
}));
app.use(function (req, res, next) {
    if (typeof(req.session.result) == 'undefined') {
        req.session.result = 0;
        console.log('resetting to 0');
    }
    next();
});

//GET
app.get('/', function(req, res) {
        res.render('index.ejs', {result: req.session.result });
});


//POST
ox.latest(function() {
    fx.rates = ox.rates;
    fx.base = ox.base;

    app.post('/', function(req, res) {
        req.session.result = changeCurrency(req.body.value);

        res.redirect('/');
    });
});

//CHANGE CURRENCY
function changeCurrency(num) {
    var pointNum = parseFloat(num);
    return fx.convert(pointNum);
}

app.listen(process.env.PORT);
console.log(process.env.PORT);

console.log('Server running at http://127.0.0.1:8080');