const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");
const authService=require("../services/authService");
const validateService=require("../services/validateService");

router.get('/login',authService.oturumAcilmamis, authController.loginFormuGoster);
router.post('/login',authService.oturumAcilmamis, authController.login);

router.get('/register', authService.oturumAcilmamis,authController.registerFormuGoster);
router.post('/register', authService.oturumAcilmamis,validateService.validateNewUser(),authController.register);

router.get('/change-password',authService.oturumAcilmis,authController.sifreDegistirmeFormuGoster);
router.post('/change-password',authService.oturumAcilmis,validateService.validateNewPassword(),authController.sifreyiDegistir);

router.get('/forget-password',authService.oturumAcilmamis, authController.forgetPasswordFormuGoster);
router.get('/forget-password/',authService.oturumAcilmamis, authController.forgetPasswordFormuGoster);
router.post('/forget-password',authService.oturumAcilmamis,validateService.validateMail(), authController.forgetPassword);

router.get('/reset-password/:id/:token',authController.yeniSifreLinki);
router.get('/reset-password',authController.yeniSifreFormuGoster);
router.post('/reset-password',validateService.validateNewPassword(),authController.yeniSifreyiKaydet);

router.get('/logout',authService.oturumAcilmis, authController.logout);

module.exports = router;