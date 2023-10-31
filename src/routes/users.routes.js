import {Router} from 'express'
import {signUpController,confirmEmailController} from '../controllers/signup.controller.js'


const router = Router();

router.post('/signup' , signUpController);
router.post('/signup/confirmEmail/:id_usuario', confirmEmailController);





export default router
