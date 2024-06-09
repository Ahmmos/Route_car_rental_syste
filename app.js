import express from 'express'
import { userRouter } from './modules/users/users.routes.js'
import { carRouter } from './modules/cars/cars.routes.js'
import { rentsRouter } from './modules/rentalStatus/rent.routes.js'


const app = express()
const port = 3000

app.use(express.json())
app.use("/users", userRouter)
app.use("/cars", carRouter)
app.use("/rents", rentsRouter)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))