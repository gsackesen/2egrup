const express = require('express');
const sequelize = require('./src/config/database');
const mainRoutes = require('./src/routes/mainRoutes');
const authRoutes = require('./src/routes/authRoutes');
const mngRoutes=require("./src/routes/mngRoutes")
const passport = require('passport');
const ejs = require('ejs');
const expressLayouts= require('express-ejs-layouts');
const path = require('path');
const i18n = require('i18n');
const flash = require('express-flash');
const session= require('express-session');
const MySQLStore = require('express-mysql-session')(session);

require('dotenv').config();

require('./src/config/passport-config')(passport);

const app = express();

//middleware formdan gelen değerlerin okunabilmesi için
app.use(express.urlencoded({ extended: true}));

// Configure i18n
i18n.configure({
    locales: ['en', 'tr'], // Supported languages
    directory: path.join(__dirname, './src/locales'),
    defaultLocale: 'en',
    queryParameter: 'lang', // Change language via ?lang=xx
    autoReload: true,
    updateFiles: false
});


//template engine ayarları
app.use(express.static('public'));
app.use(i18n.init);
app.use("/uploads", express.static(path.join(__dirname,'src/uploads')));
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './src/views'));
app.set('layouts', false);

app.use(expressLayouts);

//app.use(expressLayouts);
app.use(express.json());


const options = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DB_NAME || process.env.DB_NAME
};

const sessionStore = new MySQLStore(options);

//session & Flash message middleware
app.use(session({
  key: '2egrup',
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
        maxAge: 1000 * 60 * 60  // 1 hour
    },

}));

app.use(passport.initialize());
app.use(passport.session());



app.use(flash());
app.use((req, res, next) => {    
    res.locals.validation_error = req.flash('validation_error');
    res.locals.success_message = req.flash('success_message');
    res.locals.login_error = req.flash('error');
    

    res.locals.mail = req.flash('mail');
    res.locals.ad = req.flash('ad');
    res.locals.soyad = req.flash('soyad');
    res.locals.sifre = req.flash('sifre');
    res.locals.resifre = req.flash('resifre');
    res.locals.id = req.flash('id');
    res.locals.token = req.flash('token');

    next();
});














// Rotalar
app.use('/', mainRoutes);
app.use('/', authRoutes);
app.use('/', mngRoutes);



// DB bağlantısı ve server başlatma
sequelize.sync({ force: false }) // force:true tabloyu sıfırlar
  .then(() => {
    console.log("MySQL bağlantısı başarılı!");
    app.listen(process.env.PORT,'0.0.0.0', () => console.log("Server "+ process.env.PORT+" portunda çalışıyor"));
  })
  .catch(err => console.error("DB bağlantı hatası:", err));


