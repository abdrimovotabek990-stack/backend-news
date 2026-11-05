import { Schema, model } from "mongoose";


const CategorySchema = new Schema ({
    _id: {type: Schema.Types.ObjectId, auto: true},
    name: {type: String, required: true, unique: true, minlength: 2, maxlength: 50},
    slug: {type: String, unique: true},
    description: {type: String, maxlength: 300},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
}, {timestamps: true})

const Category = model('Category', CategorySchema)
export default Category