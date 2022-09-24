import express from 'express'
import { signinCtrl, signupCtrl } from '../controllers/auth-controller.js'

const authRouter = express.Router()

authRouter.post("/login", signinCtrl)
authRouter.post("/register", signupCtrl)


export default authRouter