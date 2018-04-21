import Server from './server'
import http = require('http')

Server.listen(3000, () => {
  console.log('App Ready On Port 3000')
})