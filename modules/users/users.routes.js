import { Router } from "express";
import { checkEmail } from "../../midddleWare/middleWare.js";
import { deleteUser, getAllUsers, getUser, signIn, signUp, updateUser } from "./users.controller.js";




export const userRouter = Router()

//sign Up route
userRouter.post("/signup",checkEmail, signUp)
// sign in route
userRouter.post("/login",signIn)
// get all user route
userRouter.get("/", getAllUsers)
// get specific user route
userRouter.get("/:id", getUser)
// Update user (owner only)
userRouter.put("/:id", updateUser)
// 6- Delete user (owner only)
userRouter.delete("/:id", deleteUser)
