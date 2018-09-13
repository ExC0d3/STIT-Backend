const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

// create a new db
const defaultItem = {users:[{pref:[], events:[], username:'', password:''}], apiUser:'stitapplicant',apiPass:'zvaaDsZHLNLFdUVZ_3cQKns'};

db.defaults(defaultItem)
  .write()

module.exports = db;