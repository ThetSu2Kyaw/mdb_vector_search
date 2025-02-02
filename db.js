const { MongoClient } = require('mongodb');
import dotenv from 'dotenv';
dotenv.config();

let dbConnection
module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(process.env.ATLAS_CONNECTION_STRING)
            .then(client => {
                dbConnection = client.db()
                return cb()
            })
            .catch(err => {
                console.log(err)
                return cb(err)
            })
    },
    getDb: () => dbConnection
}