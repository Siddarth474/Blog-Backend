import { Router } from "express";
import { 
    changeCurrentPassword,
    getcurrentUser,
    loginUser,
    registerUser, 
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/change-password').post(verifyJWT, changeCurrentPassword);
router.route('/').get(verifyJWT, getcurrentUser);

export default router