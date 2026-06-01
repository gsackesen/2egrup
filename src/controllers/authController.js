const express = require('express');
const session = require('express-session');
const passport = require('passport');
const initializePassport = require('../config/passport-config');
const {validationResult}=require ('express-validator');
const User = require("../services/userService");
const bcrypt=require("bcrypt");
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const loginFormuGoster = (req,res,next)=>{
    res.render('login',{user:req.user,layout:'./layouts/main_layout.ejs'});    
};

const registerFormuGoster = (req,res,next)=>{
    console.log(req.flash('validation_error'));
    res.render('register',{user:req.user, layout:'./layouts/main_layout.ejs'});
};

const login= (req,res,next)=>{
    
   const hatalar= validationResult(req);
    
   req.flash('mail',req.body.mail);
   req.flash('sifre',req.body.sifre);

   if (!hatalar.isEmpty()){
       req.flash('validation_error', hatalar.array());                
       res.redirect('/login');        
    } else {       
        passport.authenticate('local', {
                successRedirect:'/',
                failureRedirect: '/login',                
                failureFlash: true ,
        })(req,res,next);          
    };   
};

const logout = async (req, res, next) => {    
  
    try {
        if(req.session)
        {        
           await req.session.destroy(function (err) 
           {         
                if (err) 
                {
                    return next(err);
                } else {
                    return res.redirect('/');
                }
            }); 
        }
    }   
   catch (error) {
    next(error);
  }
};


const register = async (req,res,next)=>{
    
    const hatalar= validationResult(req);

    if (!hatalar.isEmpty()){
        req.flash('validation_error', hatalar.array());
        req.flash('mail',req.body.mail);
        req.flash('ad',req.body.ad);
        req.flash('soyad',req.body.soyad);
        req.flash('sifre',req.body.sifre);
        req.flash('resifre',req.body.resifre);
        res.redirect('/register');        
    } else {
        
        const _user=await User.getUserByMail(req.body.mail);
       

        if(_user && _user.emailAktif==true) {              
                req.flash('validation_error', [{msg:'mailexist'}]);
                req.flash('mail',req.body.mail);
                req.flash('sifre',req.body.sifre);
                req.flash('resifre',req.body.resifre);
                res.redirect('/register');        
            } else if(!_user == null || (_user && _user.emailAktif == false)){  
                 req.flash('validation_error', [{msg:'mailexist'}]);             
                req.flash('ad',req.body.ad);
                req.flash('soyad',req.body.soyad);
                req.flash('sifre',req.body.sifre);
                req.flash('resifre',req.body.resifre);
                res.redirect('/register');        
            }else if( _user == null){            
              
                try {

                    const newUser = {
                    mail: req.body.mail,
                    ad: req.body.ad,
                    soyad: req.body.soyad,
                    sifre: await bcrypt.hash(req.body.sifre, 10),
                    avatar: 'Empty_Default.png',
                    emailAktif: false,
                    role: 'GG_User'
                    };

                    await User.createUser(newUser);
                    /*
                    //jwt işlemleri
                    const jwtBilgileri = {
                        id: newUser.id,
                        mail: newUser.mail
                    };

                    const jwtToken=jwt.sign(jwtBilgileri,process.env.CONFIRM_MAIL_JWT_SECRET,{expiresIn:"1d"});                

                    // console.log(jwtToken);

                        //Mail Gönderme İşlemleri
                    const url=process.env.WEB_SITE_URL+'verify?id='+jwtToken;

                    // console.log(url);

                    let transporter =nodemailer.createTransport({
                        service: 'gmail',
                        auth:{
                            user:process.env.GMAIL_USER,
                            pass:process.env.GMAIL_SIFRE
                        }
                    });

                    await transporter.sendMail({
                        from:'NodeJS App',
                        to: newUser.mail,
                        subject:res.__('mailsubject1'),
                        text:res.__('mailtext1')+' '+url
                    },(error,info)=>{
                        if (error){
                        // console.log('Error'+error);
                        }
                    // console.log('Mail gönderildi');
                        //console.log(info);
                        transporter.close();
                    });*/

                    let transporter =nodemailer.createTransport({
                        service: 'gmail',
                        auth:{
                            user:process.env.GMAIL_USER,
                            pass:process.env.GMAIL_SIFRE
                        }
                    });

                    await transporter.sendMail({
                        from:'NodeJS App',
                        to: 'guven.sackesen@2egrup.net',
                        subject:res.__('mailsubject1'),
                        text:res.__('mailtext1')
                    },(error,info)=>{
                        if (error){                    
                        }                    
                        transporter.close();
                    });
                    req.flash('success_message',[{msg: 'wait for activation'}]);
                    res.redirect('/login');                
                }catch(error) {
                    console.error("Kullanıcı oluşturulurken hata:", error);
                    res.status(500).send("Bir hata oluştu, lütfen tekrar deneyin."+error);
                };
            };
        };
};

const sifreDegistirmeFormuGoster=async(req,res,next) => {


    res.render('change_password',{user:req.user,layout:'./layouts/main_layout.ejs'});

    /*

    if (res.locals.id.length==1 && res.locals.token.length==1){
        res.render('change_password',{layout:'./layouts/main_layout.ejs'});
    }else{
        req.flash('validation_error', [{msg:'tokenexpired'}]);          
        res.redirect('/forget-password'); 
    };
      */  
};

async function sifreyiDegistir(req, res) {
  const { oldSifre, sifre ,resifre} = req.body;
  const userId = req.user.id; // From your auth service
  

  try {    

        const user = await User.getUserById(userId);

        
        //  Verify current user active or not
        if (user.emailAktif=false){
            req.flash('error','User is not active');
            res.redirect('/change-password');
            return res.status(400);
        };

        // 1. Verify current password

        const isMatch = await bcrypt.compare(oldSifre, user.sifre);

        

        if (!isMatch) {
            req.flash('error','cpassworderror');
            res.redirect('/change-password');
            return res.status(400);
        }        
                
        // 2. compare new passwords

        if (sifre!=resifre){
            req.flash('error','comparepass');
            res.redirect('/change-password');
            return res.status(400);
        }       
        
        
        const hatalar= validationResult(req);

        if (!hatalar.isEmpty()){
            req.flash('validation_error', hatalar.array());      
            req.flash('sifre',sifre);
            req.flash('resifre',resifre);
            res.status(500);
            res.redirect('/change-password');
        } else{
              
            // 3. Hash new password
            const hashedPassword= await bcrypt.hash(sifre,10);
              
            // 4. Save to database
            const sonuc= await User.updateUser(user.id,{sifre:hashedPassword});

            if (sonuc){
                req.flash('success_message',[{msg:'pupdatesuccess'}]);
                res.redirect('/change-password');
            }else{
                req.flash('error','pupdateerror');
                res.redirect('/change-password/');
            };
        }
    }catch (err) {
        req.flash('error','tryagain');
        res.redirect('/change-password');
    };
};

const forgetPasswordFormuGoster = (req,res,next)=>{
    res.render('forget_password',{user:req.user,layout:'./layouts/main_layout.ejs'});
};

const forgetPassword = async(req,res,next)=>{
    // console.log(req.body);
    const hatalar= validationResult(req);

    if (!hatalar.isEmpty()){
        req.flash('validation_error', hatalar.array());
        req.flash('mail',req.body.mail);        
        res.redirect('/forget-password');        
    } else {
        try {
            console.log("mail" + req.body.mail);
            const _user = await User.getUserByMail(req.body.mail);
            //console.log("User: " + _user);
            
            if (_user && _user.emailAktif==true) {
              //  console.log("1");
                //jwt işlemleri
                const jwtBilgileri = {
                    id: _user.id,
                    mail: _user.mail
                };            
                //console.log(jwtBilgileri);
                const secret=process.env.RESET_PASSWORD_JWT_SECRET+"-"+_user.sifre;
                //console.log("secret "+secret);
                const jwtToken=jwt.sign(jwtBilgileri,secret,{expiresIn:"1d"}); 
                //console.log("token "+jwtToken);
                
                //Mail Gönderme İşlemleri
                const url=process.env.WEB_SITE_URL+'reset-password/'+_user.id+'/'+jwtToken;
                //console.log("2");

                let transporter =nodemailer.createTransport({
                    service: 'gmail',
                    auth:{
                        user:process.env.GMAIL_USER,
                        pass:process.env.GMAIL_SIFRE
                    }
                });

                await transporter.sendMail({
                    from:'NodeJS App',
                    to: _user.mail,
                    subject:res.__('mailsubject2'),
                    text:res.__('mailtext2')+' '+url
                },(error,info)=>{
                    if (error){
                        //console.log('Error'+error);
                    }
                   // console.log('Mail gönderildi');
                    //console.log(info);
                    transporter.close();
                });
                req.flash('success_message',[{msg: 'checkmailbox'}]);
                res.redirect('/forget-password');          




            }else {
                req.flash('validation_error', [{msg:'emailnotactive'}]);
                req.flash('mail',req.body.mail);
                res.redirect('/forget-password');            
            };
               
            
        } catch(err) {


        };
    }   
    
};

const yeniSifreLinki=async(req, res, next) =>{
    const linktekiID = req.params.id;
    const linktekiToken = req.params.token;
     
    if (linktekiID && linktekiToken){
      
        const _bulunanUser = await User.getUserById(linktekiID);
        if (_bulunanUser.emailAktif=true){
            const secret=process.env.RESET_PASSWORD_JWT_SECRET+"-"+_bulunanUser.sifre;

            try {      
                jwt.verify(linktekiToken,secret,async(e,decoded)=>{
                    if(e){
                        req.flash('error','signatureexpired');
                        res.redirect('/forget-password');
                    }else{
                        
                        if (res.locals.validation_error.length>0){
                            req.flash('validation_error', res.locals.validation_error); 
                        };   
                        const sifre=res.locals.sifre;
                        const resifre=res.locals.resifre; 
                        if (sifre.length>0 && resifre.length>0) {
                            req.flash('sifre', sifre); 
                            req.flash('resifre', resifre); 
                        };    
                        
                        req.flash('id',linktekiID);
                        req.flash('token',linktekiToken);                   
                        
                        res.redirect('/reset-password');
                        
                        
                        /*const tokenIcindekiID=decoded.id;
                        const sonuc=await User.findByIdAndUpdate(tokenIcindekiID,{emailAktif:true});
                        if(sonuc){
                            req.flash('success_message',[{msg:'Mail successfully registered'}]);
                            res.redirect('/login');
                        }else{
                            req.flash('error','Please register the user again');
                            res.redirect('/login');
                        } */
                    };
                });

            }catch (err) {
                        req.flash('error','tryagain');
                        res.redirect('/login');
            }
        } else{
            req.flash('validation_error', [{msg:'emailisnotactive'}]);          
            res.redirect('/forget-password');
        };
    }else{
        req.flash('validation_error', [{msg:'tokenexpired'}]);          
        res.redirect('/forget-password'); 
    };

};

const yeniSifreFormuGoster=async(req,res,next) => {

    if (res.locals.id.length==1 && res.locals.token.length==1){
        res.render('new_password',{user:req.user,layout:'./layouts/main_layout.ejs'});
    }else{
        req.flash('validation_error', [{msg:'tokenexpired'}]);          
        res.redirect('/forget-password'); 
    };
        
};

const yeniSifreyiKaydet = async(req,res,next)=>{

    const hatalar= validationResult(req);
    
    if (!hatalar.isEmpty()){
        req.flash('validation_error', hatalar.array());
        req.flash('sifre',req.body.sifre);
        req.flash('resifre',req.body.resifre);       
        res.redirect('/reset-password/'+req.body.id +'/'+req.body.token);
    } else{
        const _bulunanUser = await User.getUserById(req.body.id);
        
        const secret=process.env.RESET_PASSWORD_JWT_SECRET+"-"+_bulunanUser.sifre;

        try {      
            jwt.verify(req.body.token,secret,async(e,decoded)=>{
                if(e){
                    req.flash('error','signatureexpired');
                    res.redirect('/forget-password');
                }else{
                    const hashedPassword= await bcrypt.hash(req.body.sifre,10);
                    const sonuc= await User.updateUser(req.body.id,{sifre:hashedPassword});

                    if (sonuc){
                        req.flash('success_message',[{msg:'pupdatesuccess'}]);
                        res.redirect('/login');
                    }else{
                        req.flash('error','pupdateerror');
                        res.redirect('/forget-password/');
                    };                    
                };
            });

        }catch (err) {
                    req.flash('error','tryagain');
                    res.redirect('/login');
        }        
    };

};

module.exports = {
    loginFormuGoster,
    registerFormuGoster,    
    login,
    logout,
    register,
    sifreDegistirmeFormuGoster,
    sifreyiDegistir,
    forgetPasswordFormuGoster,
    forgetPassword,
    yeniSifreLinki,
    yeniSifreFormuGoster,
    yeniSifreyiKaydet
};