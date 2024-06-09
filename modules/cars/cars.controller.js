import { ObjectId } from "mongodb"
import { db } from "../../config/database.js"



//  add new car 
const addCar = async (req, res) => {
    // need token
    const { name, model, year, rentalStatus } = await req.body
    const car = await db.collection("cars").insertOne({ name: name, model: model, year: year, rentalStatus: rentalStatus })
    res.status(201).send({ message: "new car added succesfully" })

}

//  get specific cars by its id

const getCar = async (req, res) => {
    const { id } = req.params
    const car = await db.collection("cars").findOne({ _id: new ObjectId(id) }, {})
    res.status(200).send({ message: "success", car })

}

//  get All cars or search by name , model or manfacture year
const getAllCars = async (req, res) => {

    if (Object.keys(req.query).length > 0) {
        const { name, model, year, status } = req.query


        // get by model and status 
        if (name && status) {
            const cars = await db.collection("cars").find({ name: name, rentalStatus: status }).toArray()
            if (cars.length == 0) {
                return res.status(404).send({ message: "there is no result for this search" })
            }
            res.status(200).send({ message: "success", cars })

            // get car by name 

        } else if (name) {
            if (Array.isArray(name)) {
                const cars = await db.collection("cars").find({ name: { $in: name } }, {}).toArray()
                res.status(200).send({ message: "success", cars })
            } else {
                const cars = await db.collection("cars").find({ name: name }, {}).toArray()
                res.status(200).send({ message: "success", cars })
            }

            // get car by model
        } else if (model) {
            const cars = await db.collection("cars").find({ model: model }, {}).toArray()
            res.status(200).send({ message: "success", cars })

            // get car by year of manfacture
        } else if (year) {
            const cars = await db.collection("cars").find({ year: year }, {}).toArray()
            res.status(200).send({ message: "success", cars })
        }
        // get all cars
    } else {
        const cars = await db.collection("cars").find().toArray()
        res.status(200).send({ message: "success", cars })
    }

}

// Update any car details
const updateCar = async (req, res) => {
    const { id } = req.params
    const car = await db.collection("cars").findOne({ _id: new ObjectId(id) }, {})
    if (!car) {
        return res.status(404).send({ message: "there is no car with that id" })
    }
    const updatedcar = await db.collection("cars").updateOne({ _id: new ObjectId(id) }, { $set: req.body })
    res.status(200).send({ message: "car updated successfully", updatedcar })
}

// remove car from car list

const deleteCar = async (req, res) => {
    const { id } = req.params
    const car = await db.collection("cars").findOne({ _id: new ObjectId(id) }, {})
    if (!car) {
        return res.status(404).send({ message: "there is no car with that id" })
    }
    const deletedCar = await db.collection("cars").deleteOne({ _id: new ObjectId(id) })
    res.status(200).send({ message: "car deleted successfully", deletedCar })
}



export {
    addCar,
    getAllCars,
    getCar,
    updateCar,
    deleteCar

}