const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const pool = require('./database');
const myUser = require('../services/userService');

function initialize(passport) {
  passport.use(new LocalStrategy({
    usernameField: 'mail',   // formdaki input name="mail"
    passwordField: 'sifre'   // formdaki input name="sifre"
  }, async (mail, sifre, done) => {
    try {

     const user = await myUser.getUserByMail(mail);
      
      if (!user) {
        return done(null, false, { message: 'Mail bulunamadı' });
      }

      const isMatch = await bcrypt.compare(sifre, user.sifre); // veya user.password
      if (!isMatch) {
        return done(null, false, { message: 'Şifre hatalı' });
      }

      if (user.emailAktif === false) {
        return done(null, false, { message: 'Please wait for activation' });
      }

      return done(null, user);


    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const row = await myUser.getUserById(id);
      done(null, row);
    } catch (err) {
      done(err);
    }
  });
}

module.exports = initialize;
