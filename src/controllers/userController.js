const { assign } = require('nodemailer/lib/shared');
const categoryService = require('../services/categoryService');
const i18n = require('i18n');
// const userService = require('../services/userService');

/*
exports.getAllUsers = async (req, res) => {
  
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deleted = await userService.deleteUser(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    res.json({ message: "Kullanıcı silindi" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};*/

exports.indexSayfasiGoster =  async (req,res,next)=>{
    
    const lang = req.headers['accept-language'].split('-')[0].trim();

    const kategoriler = await categoryService.getCategoriesByLang(lang);

    try{
      res.render('index',{user:req.user,kategoriler,layout:'./layouts/main_layout.ejs'});
    }catch{
      res.status(500);
      console.log("Ana sayfa gösterilemedi");
    }
    
};

