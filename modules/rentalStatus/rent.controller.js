import { ObjectId } from "mongodb"
import { db } from "../../config/database.js"

// rental 
// _id , carId , customerId , rental Date , returnDate


const addRental = async (req, res) => {

    const { customerId, carId, rentalDate, returnDate } = req.body

    // check if customerId or carId missed 
    if (!customerId || !carId) {
        return res.status(404).send({ message: "customerId or carId is missed" })
    }

    const rent = await db.collection("rents").findOne({ customrId: customerId, carId: carId })

    const isAvailble = await db.collection("cars").findOne({ _id: new ObjectId(carId), rentalStatus: "available" })
    // check to prevent duplicate rental 
    if (rent) {
        return res.status(403).send({ message: "rent is already exsist" })
        // check if the car is availbe or not before create ay rental
    } else if (!isAvailble) {
        return res.status(404).send({ message: "this car not availble 'alredy rented' " })
        // create rental
    } else {
        const rentItem = await db.collection("rents").insertOne({ customerId: new ObjectId(customerId), carId: new ObjectId(carId), rentalDate: rentalDate, returnDate: returnDate })
        //change the status of the car to be rented untill the rental delete to prevent duplicated rent to the same car
        await db.collection("cars").updateOne({ _id: new ObjectId(carId) }, { $set: { rentalStatus: "rented" } })
        res.status(201).send({ message: "a rent Item is created successfully", rentItem })
    }




}

const updateRental = async (req, res) => {
    const { id } = req.params

    const rent = await db.collection('rents').findOne({ _id: new ObjectId(id) })
    // check if there is rent with that id or not
    if (!rent) {
        return res.status(404).send({ message: "there is no rent with that id" })
    }
    // update the rent with the id 
    const updatedRent = await db.collection("rents").updateOne({ _id: new ObjectId(id) }, { $set: req.body })
    res.status(200).send({ message: "rent updated successfully", updatedRent })
}


const deleteRental = async (req, res) => {
    const { id } = req.params

    const rent = await db.collection('rents').findOne({ _id: new ObjectId(id) })

    // check if there is rent with that id or not

    if (!rent) {
        return res.status(404).send({ message: "there is no rent with that id" })
    }

    // find the car and return the rentalSatuts to be availble agian before delete the rental
    const carId = await db.collection("rents").findOne({ _id: new ObjectId(id) }, { carId: 1, _id: 0 })
    await db.collection("cars").updateOne({ _id: new ObjectId(carId.carId) }, { $set: { rentalStatus: "available" } })
    const deletedRent = await db.collection("rents").deleteOne({ _id: new ObjectId(id) }, { $set: req.body })

    res.status(200).send({ message: "rent deleted successfully", deletedRent })
}

const getAllRents = async (req, res) => {

    // join customer details and car details to the rent 
    const rents = await db.collection("rents").aggregate([
        {
            $lookup: {
                from: 'customers',
                localField: 'customerId',
                foreignField: "_id",
                as: "customer"
            },

        },
        {
            $unwind: "$customer"
        },
        {
            $project: {
                _id: 1,
                // other rents fields you want to keep
                "customer.password": 0,
                "customer._id": 0

            }
        },
        {
            $lookup: {
                from: 'cars',
                localField: 'carId',
                foreignField: "_id",
                as: "car"
            }
        },
        {
            $unwind: "$car"
        }, {
            $project: {
                _id: 1,
                // other rents fields you want to keep
                "car._id": 0
            }
        }
    ]).toArray()

    // The $lookup stage performs a left join between the rents and customers collections, matching documents based on the customerId field in rents and the _id field in customers. The result is stored in the customer field.
    // The $unwind stage is used to flatten the customer array field, creating one document per customer.
    // The $project stage selects the fields we want to keep in the output - the _id field from the rents collection.
    console.log(rents)
    res.status(200).send({ message: "success", rents })

}


const getRent = async (req, res) => {
    const { id } = req.params
    const rent = await db.collection("rents").aggregate([

        {
            $match: {
                _id: new ObjectId(id)
            }
        },
        {
            $lookup: {
                from: 'customers',
                localField: 'customerId',
                foreignField: "_id",
                as: "customer"
            },

        },
        {
            $unwind: "$customer"
        },
        {
            $project: {
                _id: 1,
                // other rents fields you want to keep
                "customer.password": 0,
                "customer._id": 0

            }
        },
        {
            $lookup: {
                from: 'cars',
                localField: 'carId',
                foreignField: "_id",
                as: "car"
            }
        },
        {
            $unwind: "$car"
        }, {
            $project: {
                _id: 1,
                // other rents fields you want to keep
                "car._id": 0
            }
        }
    ]).toArray()

    res.status(200).send({ message: "success", rent })

}

export {
    addRental,
    updateRental,
    deleteRental,
    getAllRents,
    getRent
}