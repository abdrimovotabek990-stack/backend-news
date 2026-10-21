import { Schema, model } from "mongoose";


const UsersSchema = new Schema ({
    name: {type: String, required: true, minlength: 2, maxlength: 50},
    email: {type: String, required: true, unique: true, lowercase: true},
    password: {type: String, required: true},
    role: {type: String, enum: ['USER', 'ADMIN'], default: 'USER'},
    isBlocked: {type: Boolean, default: false },
    blockReason: {type: String, maxlength: 300},
    blockedAt: {type: Date, index: true} ,
    blockedBy: {type: Schema.Types.ObjectId, ref: 'Users', index: true},
    tokenVersion: {type: Number, default: 0},
}, {timestamps: true})

const Users = model('Users', UsersSchema)
export default Users