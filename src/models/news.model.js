import { Schema, model } from "mongoose";

const newsSchema = new Schema ({
    _id: {type: Schema.Types.ObjectId, auto: true},
    title: {type: String, required: true, minlength: 5, maxlength: 200},
    description: {type: String, required: true},
    slug: {type: String, required: true, unique: true, },
    images: [{type: String, required: true}],
    category: {type: Schema.Types.ObjectId, ref: 'Categories', required: true},
    author: {type: Schema.Types.ObjectId, ref: 'Users', required: true},
    tags: [{type: Schema.Types.ObjectId, ref: 'Tags', required: true}],
    status: {type: String, enum: ['PENDING', 'PUBLISHED', 'REJECTED'], default: 'PENDING'},
    rejectReason: {type: String, default: null},
    reviewedBy: {type: Schema.Types.ObjectId, ref: 'Users'},
    reviewedAt: {type: Date},
    publishedAt: {type: Date, default: Date.now},
}, {timestamps: true})

const news = model('news', newsSchema)
export default news
