import { Router } from "express";
import { addRental, deleteRental, getAllRents, getRent, updateRental } from "./rent.controller.js";



export const rentsRouter = Router()

// create a rental 


rentsRouter.post("/", addRental)

// update a rental 

rentsRouter.put('/:id', updateRental)

// delete a rental
rentsRouter.delete('/:id', deleteRental)


// get all rentals 
rentsRouter.get('/', getAllRents)

// get specific rental 

rentsRouter.get('/:id', getRent)
