import {User, IUserModel} from '../models/user'
import {Token, ITokenModel} from '../models/token'
import ApiError from '../lib/errors/api-error'
import crypto = require('crypto')
import {devEnv} from '../config/env'

class DatabaseHelper {

  static createRandomString(num : number){
    let chars = '1aAbBcCdD2eEfFgG3hHiIj4JkKl5LmMnN6oOpP7qQrRs8StTuUv9VwWxXyYzZ'
    let str = ''
    for (let i = 0; i < num; i++){
      str += chars[Math.floor(Math.random() * chars.length)]
    }
    return str
  }
  static hashPass(password: string){
    let hashingSecret = devEnv ? devEnv.hashKey : ''
    let str = crypto.createHmac('sha256', hashingSecret).update(password).digest('hex')
    return str
  }

  static getUserByUsername(username: string, projection?: object) : Promise<IUserModel | ApiError | null> {
    return User.findOne({username}, projection)
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
      (doc) => { return true }
    )
    .catch(
      (err) => {return new ApiError(500, 'Could not save user', 'SaveUserError')}
    )   
  }

  static createToken(userId: string) : Promise<ITokenModel | ApiError>{
    let token = new Token({
      userId,
      tokenString: DatabaseHelper.createRandomString(32),
      expiration: Date.now() + 1000 * 60 * 60 * 12
    })
    return token.save()
    .then(
      (doc) => { return doc}
    )
    .catch(
      (err) => {return new ApiError(500, 'Could not save token', 'TokenSaveError')}
    )
  }

  static async checkTokenAndGetUser(username: string, token: string) : Promise<IUserModel | ApiError | null>{
    try {
      // check for valid username and fetch user
      let user = await DatabaseHelper.getUserByUsername(username, {password: 0})
      if (user instanceof ApiError) return user
      else if (user) {
        // check valid token
        return Token.findOne({tokenString: token, userId: user.id})
        .then(
          (token) => {
            if (token) return user
            else return null
          }
        )
        .catch(
          (err) => {return new ApiError(500, 'Could not fetch tokens collection', 'TokenCollectionError')}
        ) 
      }
      else return new ApiError(403, 'Invalid username', 'InvalidCredentialsError')
    } catch (e) {
      return e
    }
  }
}
  
export default DatabaseHelper