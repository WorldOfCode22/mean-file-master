import { Router } from "express";
import { DataStore } from "../models/data-store";
import DatabaseHelper from "../lib/database-helper";
import ApiError from "../lib/errors/api-error";

const router = Router()

// @TODO: added file write
router.post('/', async (req, res) => {
  try {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200')
    console.log(req.body)
    // get required fields
    let username = req.body.username
    let token = req.body.token
    // check required fields given
    if (username && token){
      // get data store
    let dataStore = await DatabaseHelper.createDataStore(username, token)
    // makes sure return value was not error
    if (!(dataStore instanceof ApiError)) {
      // check to make sure username and token match
      let user = await DatabaseHelper.checkTokenAndGetUser(username, token)
      // error was raised
      if (user instanceof ApiError) throw user
      // error was not raised
      else if(user) {
        // save new user doc
        user.dataStores.push(dataStore.id)
        let newUser = await user.save()
        if (newUser){ res.status(200).json({dataStore})}
      }
      // bad username provided
      else throw new ApiError(403, 'Invalid Username', 'InvalidCredentialsError')
    }
    // error
    else throw dataStore
  } else throw new ApiError(400, 'Missing required fields', 'MissingRequiredFields')
  } catch (e) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200')
    if (e instanceof ApiError) {
      res.status(e.statusCode).json({error: e.message})
    } else {
      console.log(e)
      res.status(500).json({error: 'An internal error occurred'})
    }
  }
})
export default router