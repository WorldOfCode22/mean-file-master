import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'
import passport from 'passport'
import {devEnv} from './config/env'
import userRouter from './routes/users'

class Server {
  app = express()
  constructor(){
    this.config()
    this.routes()
  }

  config(){
    let mongooseStr : string = devEnv ? devEnv.mongooseURI : ''
    mongoose.connect(mongooseStr, (err) => {
      if (err) console.log('Database Connection Error ' + err)
      else console.log('Connected To Database')
    })

    this.app.use(bodyParser.urlencoded({ extended: true }));
    let cookieKey : string = devEnv ? devEnv.cookieKey : ''
    this.app.use(cookieSession({
      name: 'session',
      keys: [cookieKey]
    }))

    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  routes(){
    this.app.use('/users', userRouter)
  }
}

export default new Server().app