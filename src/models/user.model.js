import { Schema, model } from "mongoose";


const UsersSchema = new Schema ({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String,},
    isBlocked: {type: Boolean, default: false },
    blockReason: {type: String, required: true},
    blockedAt: {type: Date.now, index: true} ,
    blockedBy: {type: blockedBy, required: true},
    tokenVersion: {type: Number, default: 0},
}, {timestamps: true})

const Users = model('Users,', UsersSchema)
export default Users