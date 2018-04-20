import {User, IUserModel} from '../models/user'
import ApiError from '../lib/errors/api-error'
import crypto from 'crypto'
import {devEnv} from '../config/env'

class DatabaseHelper {
  static hashPass(password: string){
    let hashingSecret = devEnv ? devEnv.hashKey : ''
    let str = crypto.createHmac('sha256', hashingSecret).update(password).digest('hex')
    return str
  }

  static getUserByUsername(username: string) : Promise<IUserModel | ApiError | null> {
    return User.findOne({username})
    .then(
      (user: IUserModel | null) => { return user}
    )
    .catch(
      (err) => { return new ApiError(500, 'Could not get users collection', 'UserCollectionError')}
    )
  }

  static createUser(username : string, password : string) : Promise<boolean | ApiError> {
    password = DatabaseHelper.hashPass(password)
    let user = new User({
      username,
      password
    })
    return user.save()
    .then(
      (doc) => {
        if (doc) return true
        else return false
      }
    )
    .catch(
      (err) => {return new ApiError(500, 'Could not save user', 'SaveUserError')}
    )   
  }
}

export default DatabaseHelper