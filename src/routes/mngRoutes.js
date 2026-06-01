const router = require('express').Router();
const mngController= require('../controllers/mngController');
const authService = require('../services/authService');
const multerConfig = require('../config/multer_config');
const validateService = require('../services/validateService');
const roleService=require('../services/roleService');

//const mainController= require('../controllers/main_controller');


router.get('/profil',authService.oturumAcilmis, mngController.profilSayfasiniGoster);
router.post('/profil-guncelle',authService.oturumAcilmis,multerConfig.upload.single('avatar'),validateService.validateEditUser(),mngController.profilGuncelle);

router.get('/administration',authService.oturumAcilmis,roleService.authorizeRoles("GG_Admin"), mngController.adminSayfasiniGoster);

router.get('/addnewuser', authService.oturumAcilmis,roleService.authorizeRoles('GG_Admin'),mngController.newUserFormuGoster);
router.post('/addnewuser',authService.oturumAcilmis,roleService.authorizeRoles('GG_Admin'),validateService.validateNewUser(), mngController.newUserKaydet);

router.get('/edit-user/:id',authService.oturumAcilmis,roleService.authorizeRoles('GG_Admin'), mngController.userFormuGoster);
router.post('/edit-user/:id',authService.oturumAcilmis,roleService.authorizeRoles('GG_Admin'),validateService.validateEditUser(), mngController.editUser);

router.get('/resetpassword/:id',authService.oturumAcilmis, roleService.authorizeRoles('GG_Admin'),mngController.resetPasswordFormuGoster);
router.post('/resetpassword/:id',authService.oturumAcilmis,roleService.authorizeRoles('GG_Admin'), validateService.validateNewPassword(),mngController.resetPassword);


router.post('/delete-user/:id',authService.oturumAcilmis,roleService.authorizeRoles('GG_Admin'), mngController.deleteUser);


module.exports = router;