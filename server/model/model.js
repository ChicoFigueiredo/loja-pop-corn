var mongo = require("mongoose");

var db = mongo.connect("mongodb://localhost:27017/AngularCRUD", function(err, response) {
    if (err) { console.log(err); } else { console.log('Connected to ' + db, ' + ', response); }
});


var Schema = mongo.Schema;

var UsersSchema = new Schema({
    name: { type: String },
    address: { type: String },
}, { versionKey: false });


var model = mongo.model('users', UsersSchema, 'users');

module.exports = model;