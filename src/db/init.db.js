'use strict';
const mongoose = require('mongoose');
const {
    db: { name, password, domain, extra },
} = require('../configs/config.db');
const connectString = `mongodb+srv://${domain}:${password}@${extra}.0xtxlqi.mongodb.net/${name}`;

class Database {
    constructor() {
        this.connect();
    }
    // connect
    connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }
        mongoose
            .connect(connectString, {
                maxPoolSize: 50,
            })
            .then((_) => {
                console.log(`Connected to Mongodb ${name}`);
            })
            .catch((err) => {
                console.log('error connecting to Mongodb', err.message);
            });
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}
const instanceMongoDb = Database.getInstance();
module.exports = instanceMongoDb;
