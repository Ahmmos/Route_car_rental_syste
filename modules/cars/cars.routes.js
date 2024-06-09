import { Router } from "express";
import { addCar, deleteCar, getAllCars, getCar, updateCar } from "./cars.controller.js";



export const carRouter = Router()


// Add car
carRouter.post("/", addCar)

// get All cars
carRouter.get("/", getAllCars)

// get specific car
carRouter.get("/:id", getCar)

// Update Car 
carRouter.put("/:id", updateCar)

// delete Car
carRouter.delete("/:id", deleteCar)


