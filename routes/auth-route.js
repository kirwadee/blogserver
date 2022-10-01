import express from 'express'
import { logoutCtrl, signinCtrl, signupCtrl } from '../controllers/auth-controller.js'

const authRouter = express.Router()

authRouter.post("/login", signinCtrl)
authRouter.post("/register", signupCtrl)
authRouter.post("/logout", logoutCtrl )


export default authRouter