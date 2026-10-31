import { Schema, model } from "mongoose";


const imageSchema = new Schema({
    url: { type: String, required: true },
    filename: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true }
}, { _id: false });


const newsSchema = new Schema ({
    _id: {type: Schema.Types.ObjectId, auto: true},
    title: {type: String, required: true, minlength: 5, maxlength: 200, trim: true},
    description: {type: String, required: true, minlength: 20},
    slug: {type: String, required: true, unique: true, trim: true},
    images: {type: [imageSchema], default: [], validate: [arr => arr.length <= 10, '10 tagacha rasm yuklay olasz ']},
    category: {type: Schema.Types.ObjectId, ref: 'Categories', required: true, index: true}, 
    author: {type: Schema.Types.ObjectId, ref: 'Users', required: true, index: true},
    tags: [{type: Schema.Types.ObjectId, ref: 'Tag', required: true}], default: [], validate: [arr => arr.length <= 10, '10 tagacha teg qo\'shishingiz mumkin'],
    status: {type: String, enum: ['PENDING', 'PUBLISHED', 'REJECTED'], default: 'PENDING'},
    rejectReason: {type: String,maxlength: 300, default: null},
    reviewedBy: {type: Schema.Types.ObjectId, ref: 'Users', default: null},
    reviewedAt: {type: Date, default: null},
    publishedAt: {type: Date, default: null},
}, {timestamps: true})

// Ommaviy ro'yxat 
newsSchema.index({ status: 1, createdAt: -1 });

// Matn bo'yicha qidiruv 
newsSchema.index({ title: "text", description: "text" });

const News = model('news', newsSchema)
export default News
