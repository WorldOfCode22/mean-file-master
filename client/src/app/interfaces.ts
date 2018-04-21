interface dataStore {
  userId?: string
  lastUpdated: number
}
interface User {
  username?: string
  dataStores?: dataStore[]
}

export {User, dataStore}