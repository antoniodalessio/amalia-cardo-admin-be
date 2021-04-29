import { Schema, Document } from 'mongoose';

const user: Schema = new Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    username: {
        type: String
    },
    hash: {
        type: String
    },
    token: {
        type: String
    }
})

interface IUser extends Document {
    firstname: string;
    lastname: string;
    username: string;
    hash: string;
    token: string;
}

export { 
    user,
    IUser
}