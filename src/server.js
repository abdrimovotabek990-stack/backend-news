import express from 'express'
import *as dotenv from 'dotenv'
import mongoose from 'mongoose'
import cokieParser from 'cookie-parser'

import authRouter from './routes/auth.route.js'
import categoryRouter from './routes/category.route.js'


import notFound from './middlewares/notFound.middleware.js'
import errorHandler from './middlewares/errorHandler.middleware.js'



const app = express()
dotenv.config()
app.use(express.json())
app.use(cokieParser())


app.use('/', authRouter)
app.use('/', categoryRouter)

app.use(notFound)
app.use(errorHandler)



const startApp = () => {
    try {
        mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB bazasiga muvaffaqiyatli ulandi");
    })
    .catch((err) => {
        console.log("Bazaga ulanishda xatolik yuz berdi:", err);
    });

    const PORT = process.env.PORT  || 5060
    app.listen(PORT, () => console.log(`Server http://localhost:${process.env.PORT}/ da ishlayabdi`))
    } catch (error) {
        console.log(error)
    }
}

startApp()