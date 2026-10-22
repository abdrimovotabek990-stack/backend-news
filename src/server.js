import express from 'express'
import *as dotenv from 'dotenv'
import mongoose from 'mongoose'
import cokieParser from 'cookie-parser'



const app = express()
dotenv.config()
app.use(express.json())
app.use(cokieParser())

app.get('/', (req, res) => {
    res.send('matn')
})





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