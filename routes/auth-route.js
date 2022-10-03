import express from 'express'
import { googleAuthCtrl, logoutCtrl, signinCtrl, signupCtrl } from '../controllers/auth-controller.js'

const authRouter = express.Router()

authRouter.post("/login", signinCtrl)
authRouter.post("/register", signupCtrl)
authRouter.post("/google", googleAuthCtrl)
authRouter.post("/logout", logoutCtrl )


export default authRouter