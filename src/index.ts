import 'dotenv/config'

import config from 'config'
import app from './app'

const port: number = config.get('server.port')

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
