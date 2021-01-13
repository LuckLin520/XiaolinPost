let express = require('express');
let axios = require("axios");
const bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/'))
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,PATCH,OPTIONS");
    next()
});
app.get('/', (req, res)=>{
    res.send('<div style=margin:50px;text-align:center><h1>welcome to xiaolin-post!!!</h1><br/><p>concat:ZhiLin Zhao qq:502763576 tell:15348298177</p></div>')
})
app.post('/XIAOLIN-POST', async(req, res)=>{
    axios(req.body).then(re=>{
        console.log(re)
        res.send({
            code:1,
            data:re.data
        })
    }).catch(err=>{
        res.send({
            code:0,
            msg:err
        })
    })
})
app.listen(8888,err=>{
    if(!err) console.log('start on 8888....')
})