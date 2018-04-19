import Server from './server'
import http from 'http'

Server.listen(3000, () => {
  console.log('App Ready On Port 3000')
})