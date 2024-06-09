
import bcrypt from 'bcrypt'
import { db } from '../config/database.js'


// middleware for checkif email exist or not 

export const checkEmail = async (req, res, next) => {
    const { email, password } = await req.body
    let user = await  db.collection("customers").findOne({ email: email }, { email: 1, password: 1, _id: 0 })
    if (user !== null) return res.status(409).send({ message: "email is already exist" })
    // // hashing password
    req.body.password = bcrypt.hashSync(req.body.password, 8)
    next()
}

