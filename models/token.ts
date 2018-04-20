import {Document, Schema, Model, model} from 'mongoose'

interface IToken {
  userId?: string, 
  tokenString?: string,
  expiration?: number
}

export interface ITokenModel extends IToken, Document {}

export let TokenSchema : Schema = new Schema({
  userId: String, 
  tokenString: String,
  expiration: Number
})

export const Token: Model<ITokenModel> = model<ITokenModel>('token', TokenSchema)