class ApiError extends Error {
  statusCode : number
  name : string
  constructor(statusCode: number, message: string, name: string){
    super(message)
    this.statusCode = statusCode
    this.name = name
    this.checkName()
  }

  checkName(){
    let nameArray: string[] = ['UserCollectionError', 'UsernameTaken', 'MissingRequiredFields', 'SaveUserError', 'InvalidCredentialsError', 'TokenSaveError', 'TokenCollectionError']
    if (nameArray.indexOf(this.name) === -1) throw new Error('Error name must match a name in the name array')
  }
}

export default ApiError