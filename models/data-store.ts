import {Document, Schema, Model, model} from 'mongoose'

export interface IDataStore {
  userId?: string, 
  lastUpdated?: number
}

export interface IDataStoreModel extends IDataStore, Document {}

export let DataStoreSchema : Schema = new Schema({
  userId: String, 
  lastUpdated: Number
})

export const DataStore: Model<IDataStoreModel> = model<IDataStoreModel>('data-store', DataStoreSchema)