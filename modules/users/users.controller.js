import { ObjectId } from "mongodb"
import { db } from "../../config/database.js"
import bcrypt from 'bcrypt'

// sign Up
const signUp = async (req, res) => {
    const { email, name, password, phone } = await req.body
    if (!name || !email || !password || !phone) {
        res.status(406).send({ message: "you should full all fields" })
    } else {
        await db.collection('customers').insertOne({ name: name, email: email, password: password, phoneNumber: phone })
        res.status(201).send({ message: "new customer added succesfully" })
    }
}

// sign In

const signIn = async (req, res) => {
    const { email } = req.body
    const user = await db.collection("customers").findOne({ email: email }, { email: 1, password: 1, _id: 1 })

    if (user !== null) {
        const isMatch = bcrypt.compareSync(req.body.password, user.password)
        if (!isMatch) {
            return res.status(401).send({ message: "Invalid username or Password" })
        } else {
            res.status(200).send({ message: "logged in successfully", userId: user._id })
        }
    } else {
        res.status(401).send({ message: "Invalid email or Password" })
    }

}

// get All users 
const getAllUsers = async (req, res) => {
    const users = await db.collection("customers").find().toArray()

    res.status(200).send(users)
}

// get specific user by his id 
const getUser = async (req, res) => {
    const { id } = req.params

    const user = await db.collection("customers").findOne({ _id: new ObjectId(id) }, {})
    if (!user) {
        return res.status(404).send({ message: "there is no user with this id" })
    }
    res.status(200).send(user)
}

// update User
const updateUser = async (req, res) => {
    //should be check for token first before update 
    const { id } = req.params
    const user = await db.collection("customers").findOne({ _id: new ObjectId(id) }, {})
    if (!user) {
        return res.status(404).send({ message: "there is no user with this id" })
    }
    await db.collection("customers").updateOne({ _id: new ObjectId(id) }, { $set: req.body })

    res.status(200).send({ message: "updated successfully" })
}

// delete user
const deleteUser = async (req, res) => {
    //should be check for token before delete
    const { id } = req.params
    const user = await db.collection("customers").findOne({ _id: new ObjectId(id) }, {})
    if (!user) {
        return res.status(404).send({ message: "there is no user with this id" })
    }
    await db.collection("customers").deleteOne({ _id: new ObjectId(id) })
    res.status(200).send({ message: `user ${user.name} has been deleted successfully` })
}


export {
    signUp,
    signIn,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
}