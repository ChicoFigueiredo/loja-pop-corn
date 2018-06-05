var mongo = {};
var model = {};
var LinguagemSchema = {};
var CategoriesSchema = {};

module.exports = function(url = '', initialize = false) {
    mongo[url] = mongo[url] || require('./_db')(url);
    let prefix = mongo[url].urlToTable(url);

    if (!LinguagemSchema[url]) {
        LinguagemSchema[url] = mongo[url].Schema({
            pt: { type: String, required: false, trim: true },
            es: { type: String, required: false, trim: true },
            en: { type: String, required: false, trim: true },
        }, { versionKey: false, _id: false, strict: false });
    }

    if (!CategoriesSchema[url]) {
        CategoriesSchema[url] = mongo[url].Schema({
            id: { type: Number, required: true, trim: true, index: true, unique: true },
            name: LinguagemSchema[url],
            description: LinguagemSchema[url],
            handle: LinguagemSchema[url],
            parent: { type: Number, trim: true },
            subcategories: [],
            seo_title: LinguagemSchema[url],
            seo_description: LinguagemSchema[url],
            created_at: { type: String, trim: true },
            updated_at: { type: String, trim: true },
            published: { type: Boolean, required: true, trim: true, index: true, default: true },
        }, { versionKey: false, _id: true });
    }

    model[url] = model[url] || mongo[url].model('categorias' + url, CategoriesSchema[url], prefix + 'categorias');

    if (initialize) initializeCategorias(model[url]);

    return model[url];
}

function initializeCategorias(model) {
    var na = {
        "id": 2250509,
        "name": {
            "pt": "MEIO AMBIENTE"
        },
        "description": {
            "pt": ""
        },
        "handle": {
            "pt": "meio-ambiente"
        },
        "parent": 0,
        "subcategories": [],
        "seo_title": {
            "pt": null
        },
        "seo_description": {
            "pt": null
        },
        "created_at": "2017-09-10T14:00:30+00:00",
        "updated_at": "2018-03-22T00:47:18+00:00"
    }

    model.findOneAndUpdate({ id: 21421838 }, // find a document with that filter
        na, // document to insert when nothing was found
        { upsert: true, new: false, runValidators: true, strict: true }, // options
        function(err, alunos) { // callback
            if (err) {
                console.log('fudeu ' + JSON.stringify(err));
            }
        });
}