import {Document, Schema, Model, model} from 'mongoose'
import { IDataStore } from './data-store';

interface IUser {
  username?: string, 
  password?: string,
  dataStores: string[]
}

export interface IUserModel extends IUser, Document {}

export let UserSchema : Schema = new Schema({
  username: String,
  password: String,
  dataStores: Array
})

export const User: Model<IUserModel> = model<IUserModel>('user', UserSchema)