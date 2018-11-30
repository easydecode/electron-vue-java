import Datastore from 'nedb'

export default new Datastore({
  autoload: true,
  filename: '/data/data.db'
})
