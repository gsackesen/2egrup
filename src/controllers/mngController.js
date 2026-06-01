const {validationResult}=require ('express-validator');
const User=require("../services/userService");
const bcrypt = require('bcrypt');

const profilSayfasiniGoster = function(req,res,next){

    res.render('profil',{user:req.user,layout:'./layouts/main_layout.ejs'});
}

const profilGuncelle = async function(req,res,next){
    
     const hatalar= validationResult(req);

    const guncelBilgiler={
        ad:req.body.ad,
        soyad:req.body.soyad,                        
    }
    
    if(req.file){
            guncelBilgiler.avatar=req.file.filename;
        }

    if (!hatalar.isEmpty()){
            
           req.flash('validation_error', hatalar.array());                
           res.redirect('/profil');        
           
    } else {    
        
        try{ 
           
            const sonuc= await User.updateUser(req.user.id,guncelBilgiler);           

            if (sonuc){
                req.flash('success_message',[{msg:'updatesuccess'}]);
                res.redirect("/profil");  
            }else{
                req.flash('error','updateerror');
                res.redirect("/profil");  
            };
        }
        catch(err){
            //console.log(err);
        };                   
    };    
}

// Admin sayfasını gösteren controller
const adminSayfasiniGoster = async function(req, res, next) {
  try {
    const users = await User.getAllUsers(); // await ile çağır
    //console.log("Kullanıcı Listesi:", users);

    res.render('administration', {
      user: req.user,
      users: users, // array olarak gönder
      layout: './layouts/main_layout.ejs'
    });
  } catch (error) {
    req.flash('error', 'dataerror' + error);
    res.redirect('/administration');
  }
};

const newUserFormuGoster=async(req,res) => {   
    
    res.render('addnewuser',{user:req.user,layout:'./layouts/main_layout.ejs'});   
};

const newUserKaydet=async(req,res) => {   

    const hatalar= validationResult(req);

    if (!hatalar.isEmpty()){
        req.flash('validation_error', hatalar.array());
        req.flash('mail',req.body.mail);
        req.flash('ad',req.body.ad);
        req.flash('soyad',req.body.soyad);
        req.flash('sifre',req.body.sifre);
        req.flash('resifre',req.body.resifre);
        res.redirect('/addnewuser');        
    } else {
        try {
                 
            const _user = await User.getUserByMail(req.body.mail);
             
           
            if(_user && _user.emailAktif==true) {
                req.flash('validation_error', [{msg:'mailexist'}]);
                req.flash('mail',req.body.mail);
                req.flash('ad',req.body.ad);
                req.flash('soyad',req.body.soyad);
                req.flash('sifre',req.body.sifre);
                req.flash('resifre',req.body.resifre);
                res.redirect('/addnewuser');        
            }else if((_user && _user.emailAktif == false) || _user == null){
               
               
                if (_user){  
                    await User.deleteUser(_user.id);
                }
               
                const newUser = {
                    mail:req.body.mail,
                    ad:req.body.ad,
                    soyad:req.body.soyad,
                    role:req.body.role,
                    avatar: 'Empty_Default.png',
                    emailAktif:req.body.emailAktif,
                    sifre: await bcrypt.hash(req.body.sifre,10)
                };               

                const sonuc= await User.createUser(newUser); 
                
                if (sonuc){
                    req.flash('success_message',[{msg: 'usercreated'}]);
                    res.redirect('/administration'); 
                } else {
                    req.flash('validation_error', [{msg:'usercouldntcreated'}]);
                    req.flash('mail',req.body.mail);
                    req.flash('ad',req.body.ad);
                    req.flash('soyad',req.body.soyad);
                    req.flash('sifre',req.body.sifre);
                    req.flash('resifre',req.body.resifre);
                    res.redirect('/addnewuser');   
                };                               
            }
        }catch(err) {

        };
    };    
};  


const userFormuGoster=async(req,res) => {
    console.log(req.params.id);
    const userId = req.params.id;
    const selectedUser=await User.getUserById(userId);
    res.render('edit-user',{user:req.user,userId,selectedUser,layout:'./layouts/main_layout.ejs'});   
};

const editUser = async function(req,res){
    const userId = req.params.id;
    const { ad, soyad ,role,emailAktif} = req.body;
   
    const guncelBilgiler={
        ad,
        soyad,
        role,
        emailAktif
    }

    const hatalar= validationResult(req);
    
    
        if (!hatalar.isEmpty()){
            req.flash('validation_error', hatalar.array());
                  
            res.redirect('/edit-user/'+userId);        
        } else {
   
            try{
                
                const sonuc=await User.updateUser(userId,guncelBilgiler);
                if(sonuc){
                  req.flash('success_message',[{msg:'userupdated'}]);          
                  res.redirect("/administration");
                };      
                
            }
            catch(err){
                //console.log(err);
            };
          };
};


const resetPasswordFormuGoster=async(req,res,next) => {
    const userId = req.params.id;
    res.render('resetpassword',{user:req.user,userId,layout:'./layouts/main_layout.ejs'});   
};

async function resetPassword(req, res) {
  const {sifre,resifre} = req.body;
  const userId = req.params.id;
  
  

  const hatalar= validationResult(req);

  if (!hatalar.isEmpty()){
            req.flash('validation_error', hatalar.array());                  
            res.redirect('/resetpassword/'+userId);       
        } else {
  
    try {
      const user = await User.getUserById(userId);

      
      // 1. Hash new password
      const hashedPassword= await bcrypt.hash(sifre,10);
      // 2. Save to database
      const sonuc= await User.updateUser(user.id ,{sifre:hashedPassword});

      //console.log ("sonuc:" + sonuc);
      if (sonuc){
        req.flash('success_message',[{msg:'pupdatesuccess'}]);
        res.redirect("/administration");
      }else{
        req.flash('error','pupdateerror');
        res.redirect('/administration');
      };    

    }catch (err) {
        req.flash('error','tryagain');
        res.render('administration',{user:req.user,users,layout:'./layouts/main_layout.ejs'});
      };
    };
  };



const deleteUser=async (req, res) => {
    
  try {
    await User.deleteUser(req.params.id);
    req.flash('success_message', [{ msg: 'userdeleted' }]);
    res.redirect('/administration');
  } catch (err) {
    console.error(err);
    req.flash('error_message', [{ msg: 'userdeletefail' }]);
    res.redirect('/administration');
  }
};




module.exports={
    profilSayfasiniGoster,
    profilGuncelle,
    adminSayfasiniGoster,
    newUserFormuGoster,
    newUserKaydet,
    userFormuGoster,
    editUser,
    resetPasswordFormuGoster,
    resetPassword,
    deleteUser
}