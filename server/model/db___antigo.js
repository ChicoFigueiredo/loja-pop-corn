var mongo = require('mongoose');

var db = mongo.connect("mongodb://localhost:27017/CLBeneficios", function(err, response) {
    //if (err) { console.log(err); } else { console.log('Connected to ' + db, ' + ', response); }
});

module.exports = mongo;