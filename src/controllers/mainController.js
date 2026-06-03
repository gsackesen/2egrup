const {validationResult}=require ('express-validator');
const Kategori=require("../services/categoryService");
//const User=require("../services/userService");


const kategoriSayfasiniGoster = async function(req, res, next) {
  try {
    const kategoriler = await Kategori.getAllCategories(); // await ile çağır
    //console.log("Kullanıcı Listesi:", users);

    res.render('kategori', {
      user: req.user,
      kategori: kategoriler, // array olarak gönder
      layout: './layouts/main_layout.ejs'
    });
  } catch (error) {
    req.flash('error', 'dataerror' + error);
    res.redirect('/category');
  }
};
const newCategoryFormuGoster=async(req,res) => {   
    
    res.render('addnewcategory',{user:req.user,layout:'./layouts/main_layout.ejs'});   
};

const newCategoryKaydet=async(req,res) => {   

    const hatalar= validationResult(req);

    if (!hatalar.isEmpty()){
        req.flash('validation_error', hatalar.array());        
        req.flash('kategori',req.body.kategori);
        req.flash('aciklama',req.body.aciklama); 
        req.flash('dil',req.body.dil);        
        res.redirect('/addnewcategory');        
    } else {
        try {
                 
            const _kategori = await Kategori.getByName(req.body.kategori);
           
            if(_kategori) {               
                req.flash('validation_error', [{msg:'categoryexist'}]);                
                req.flash('kategori',req.body.kategori);
                req.flash('aciklama',req.body.aciklama);
                req.flash('dil',req.body.dil);                
                res.redirect('/addnewcategory');        
            }else{

                const newCategory = {
                    kategori:req.body.kategori,
                    aciklama:req.body.aciklama,
                    dil:req.body.dil                    
                };               

                const sonuc= await Kategori.createCategory(newCategory); 
                
                if (sonuc){
                    req.flash('success_message',[{msg: 'categorycreated'}]);
                    res.redirect('/category'); 
                } else {
                    req.flash('validation_error', [{msg:'categorycouldntcreated'}]);
                    req.flash('kategori',req.body.kategori);
                    req.flash('aciklama',req.body.aciklama);                     
                    res.redirect('/addnewcategory');   
                };                               
            }
        }catch(err) {

        };
    };    
};  

const editCategoryFormuGoster=async(req,res) => {    
    const categoryId = req.params.id;
    const selectedCategory=await Kategori.getCategoryById(categoryId);
    res.render('addnewcategory',{user:req.user,categoryId,selectedCategory,layout:'./layouts/main_layout.ejs'});   
};

const editCategoryFormuKaydet=async(req,res) => {   

    const hatalar= validationResult(req);

    catId=req.params.id;
    
    if (!hatalar.isEmpty()){       
        req.flash('validation_error', hatalar.array());        
        req.flash('kategori',req.body.kategori);
        req.flash('aciklama',req.body.aciklama); 
        req.flash('dil',req.body.dil);        
        res.redirect('/editcategory/'+catId);        
    } else {
        try {           
                 
            const editCategory = {                    
                kategori:req.body.kategori,
                aciklama:req.body.aciklama,
                dil:req.body.dil                    
            };          
           

            const sonuc= await Kategori.updateCategory(catId,editCategory); 

            console.log("3");
            
            if (sonuc){
                req.flash('success_message',[{msg: 'categoryedited'}]);
                res.redirect('/category'); 
            } else {
                req.flash('validation_error', [{msg:'categorycouldntcreated'}]);
                req.flash('kategori',req.body.kategori);
                req.flash('aciklama',req.body.aciklama);                     
                res.redirect('/editcategory/'+catId);   
            };                               
        
        }catch(err) {

        };
    };    
};  

module.exports={
    kategoriSayfasiniGoster,
    newCategoryFormuGoster,
    newCategoryKaydet,
    editCategoryFormuGoster,
    editCategoryFormuKaydet
    /*
    profilSayfasiniGoster,
    profilGuncelle,
    adminSayfasiniGoster,
    newUserFormuGoster,
    newUserKaydet,
    userFormuGoster,
    editUser,
    resetPasswordFormuGoster,
    resetPassword,
    deleteUser*/
}