import { Schema, model } from "mongoose";

const TagsSchema = new Schema ({
    _id: {type: Schema.Types.ObjectId, auto: true},
    name: {type: String, required: true, unique: true, minlength: 2, maxlength: 30},
    slug: {type: String, unique: true},
}, {timestamps: true})

const Tags = model('Tags', TagsSchema)
export default Tags