var mongo = require('./db');

// var Schema = mongo.Schema;

var UsersSchema = mongo.Schema({
    name: { type: String, index: true, unique: true },
    address: { type: String },
    link: { type: String },
}, { versionKey: false });

var model = mongo.model('users', UsersSchema, 'users');

module.exports = model;