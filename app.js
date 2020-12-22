const express = require('express');
const nunjucks = require('nunjucks');
var path = require('path');
const app = express();
var cookieParser = require('cookie-parser');
const PORT= process.env.PORT || 3000;
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Session = require('express-session');
const flash = require('connect-flash');
var MongoDBStore = require('connect-mongodb-session')(Session);
var logger = require('morgan');
app.use(bodyParser.urlencoded({extended: true}));
app.use(Session({
    secret:'dalhav', //세션 암호화 key
    resave:false,//세션 재저장 여부
    saveUninitialized:true,
    rolling:true,//로그인 상태에서 페이지 이동 시마다 세션값 변경 여부
    cookie:{maxAge:1000*60*60},//유효시간
    store: store
}));
var port = process.env.PORT || 3000;
app.use(passport.initialize());
app.use(passport.session());
// DB연결
let url =  "mongodb://localhost:27017/project";
mongoose.connect(url, {useNewUrlParser: true});
// routes
const indexRoute      = require("./routes/index");

app.set('views', path.join(__dirname, 'views'));

nunjucks.configure('views', {
  express: app,
  watch: true
});

app.set('views', path.join(__dirname, 'views'));

nunjucks.configure('views', {
  express: app,
  watch: true
});

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static(path.join(__dirname, 'public')));

//html 페이지 추가
app.use(express.static(__dirname + '/')); 
app.get('/views',function(req,res){
    res.sendFile(__dirname + 'index.html');
});
app.get('/views',function(req,res){
  res.sendFile(__dirname + 'visitor.html');
});
app.get('/views',function(req,res){
  res.sendFile(__dirname + 'guest.html');
});

// 뷰엔진 설정
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.static(__dirname + "/public"));

// use routes
app.use("/", indexRoute);

//listen
app.listen(PORT, function () {
    console.log('Example app listening on port',PORT);
});


//세션
var store = new MongoDBStore({//세션을 저장할 공간
    uri: url,//db url
    collection: 'sessions'//콜렉션 이름
});

store.on('error', function(error) {//에러처리
    console.log(error);
});



app.use(flash());
