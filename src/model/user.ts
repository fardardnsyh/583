import mongoose, { Document, Schema } from "mongoose";

export interface Message extends Document {
    _id: string,
    content: string,
    createdAt: Date
}

const messageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

export interface user extends Document {
    username: string;
    email: string;
    password: string;
    isAcceptingMessage: boolean;
    isVerified: boolean;
    verifyCode?: string;
    verifyCodeExpiry?: Date;
    passwordResetCode?: string;
    PasswordResetCodeExpiry?: Date;
    messages: Message[]
}

const userSchema: Schema<user> = new Schema({
    username: {
        type: String,
        required: [true, "Username is requried"],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+\@.+\..+/, 'Please use a valid email address'],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyCode: {
        type: String
    },
    verifyCodeExpiry: {
        type: Date
    },
    passwordResetCode: {
        type: String
    },
    PasswordResetCodeExpiry: {
        type: Date
    },
    messages: {
        type: [messageSchema],
        default: []
    }
}, { timestamps: true })

const UserModel = (mongoose.models.User as mongoose.Model<user>) || mongoose.model<user>("User", userSchema);
export default UserModel