const express = require('express');
const router = express.Router();
const mainController = require("../controllers/mainController");
const userController = require("../controllers/userController");
const authService=require("../services/authService");
const roleService=require("../services/roleService")
const validateService=require("../services/validateService")

router.get('/',userController.indexSayfasiGoster);
router.get('/category',authService.oturumAcilmis,roleService.authorizeRoles("GG_Admin"), mainController.kategoriSayfasiniGoster);

router.get('/addnewcategory', authService.oturumAcilmis,roleService.authorizeRoles('GG_Admin'),mainController.newCategoryFormuGoster);
router.post('/addnewcategory',authService.oturumAcilmis,roleService.authorizeRoles('GG_Admin'),validateService.validateKategori(), mainController.newCategoryKaydet);

router.get('/editcategory/:id', authService.oturumAcilmis,roleService.authorizeRoles('GG_Admin'),mainController.editCategoryFormuGoster);
router.post('/editcategory/:id', authService.oturumAcilmis,roleService.authorizeRoles('GG_Admin'),validateService.validateKategori(),mainController.editCategoryFormuKaydet);



module.exports = router;