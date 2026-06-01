const oturumAcilmis=function(req,res,next){
    if(req.isAuthenticated()){
         return next();
    }else{           
        res.render('index',{user:req.user,layout:'./layouts/main_layout.ejs'});        
    }
};

const oturumAcilmamis=function(req,res,next){
   
    if(!req.isAuthenticated()){    
        return next();
    } else{        
    }  
         
}


const oturumKontrol = (req, res, next) => {
  if (req.isAuthenticated) {
    req.isLoggedIn = true;
  } else {
    req.isLoggedIn = false;
  }
  next();
};

module.exports={
    oturumAcilmis,
    oturumAcilmamis,
    oturumKontrol    
}