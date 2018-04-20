import {Router} from 'express'
import ApiError from '../lib/errors/api-error'
import DatabaseHelper from '../lib/database-helper'
import { IUserModel } from '../models/user';
import {devEnv} from '../config/env'

const router = Router()

router.post('/register', async (req, res) => {
  try {
    // check required fields
    let username = req.body.username
    let password = req.body.password
    if (username && password) {
      // see if user already exist
      let user = await DatabaseHelper.getUserByUsername(username)
      if (user) {
        throw new ApiError(400, 'Username taken', 'UsernameTaken')
        // create new user
      } else {
        let newUser = DatabaseHelper.createUser(username, password)
        if (newUser instanceof ApiError) throw newUser
        else res.status(200).json({message: 'User Created'})
      }
      // if missing required field     
    } else {
      throw new ApiError(400, 'Username and password are required', 'MissingRequiredFields')
    }
  } catch (e) {
    if (e instanceof ApiError) {
      res.status(e.statusCode).json({error: e.message})
    } else {
      res.status(500).json({error: 'An internal error occurred'})
    }
  }
})

router.post('/login', async (req, res) => {
  if (devEnv) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200')
  }
  try {
  // required fields
  console.log(req.body)
  let username = req.body.username
  let password = req.body.password
  console.log(username, password)
  // check required fields
  if (username && password) {
    // get user
    let user  = await DatabaseHelper.getUserByUsername(username)
    if (user) {
      if ( user instanceof ApiError) { throw user}
      // check user gave correct password
      else {
        if (user.password === DatabaseHelper.hashPass(password)) {
          // user provided correct credentials now provide user token
          let token = await DatabaseHelper.createToken(user.id)
          if (token instanceof ApiError) throw token
          else res.status(200).json({token: token.tokenString})
          // wrong pass
        } else { throw new ApiError(400, 'Invalid username or password', 'InvalidCredentialsError') }
      }
      // wrong username
    } else {
      throw new ApiError(400, 'Invalid username or password', 'InvalidCredentialsError')
    }
    // missing require fields
  } else {
    throw new ApiError(400, 'Username and password are required', 'MissingRequiredFields')
  }
  } catch (e) {
    if (e instanceof ApiError) {
      res.status(e.statusCode).json({error: e.message})
    } else {
      console.log(e)
      res.status(500).json({error: 'An internal error occurred'})
    }
  }
})
export default router