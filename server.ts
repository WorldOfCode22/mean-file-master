import express from 'express'
import mongoose from 'mongoose'
import {devEnv} from './config/env'

class Server {
  app = express()
  constructor(){
    this.config()
  }

  config(){
    let mongooseStr : string = devEnv ? devEnv.mongooseURI : ''
    mongoose.connect(mongooseStr, (err) => {
      if (err) console.log('Database Connection Error ' + err)
      else console.log('Connected To Database')
    })
  }
}

export default new Server().app