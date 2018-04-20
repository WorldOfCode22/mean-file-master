import {User, IUserModel} from '../models/user'
import {Token, ITokenModel} from '../models/token'
import ApiError from '../lib/errors/api-error'
import crypto from 'crypto'
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

  static getToken(username: string, token: string) : Promise<ITokenModel | ApiError | null>{
    return Token.findOne({username, token})
    .then(
      (doc) => {return doc}
    )

    .catch(
      (err) => { return new ApiError(500, 'Could not get token collection', 'TokenCollectionError') }
    )
  }
}
  
export default DatabaseHelper