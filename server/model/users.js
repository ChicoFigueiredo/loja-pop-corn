var mongo = require('./ultra-pos/_db')('');

// var Schema = mongo.Schema;

var UsersSchema = mongo.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        index: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: true,
    },
    passwordConf: {
        type: String,
        required: true,
    }
}, { versionKey: false });

var model = mongo.model('users', UsersSchema, 'users');

module.exports = model;