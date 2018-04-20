import {Document, Schema, Model, model} from 'mongoose'

interface IUser {
  username?: string, 
  password?: string
}

export interface IUserModel extends IUser, Document {}

export let UserSchema : Schema = new Schema({
  username: String,
  password: String
})

export const User: Model<IUserModel> = model<IUserModel>('user', UserSchema)