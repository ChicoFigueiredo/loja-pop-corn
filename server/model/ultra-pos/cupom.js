var mongo = {};
var model = {};
var CupomSchema = {};

module.exports = function(url = 'localhost', initialize = false) {
    //if (mongo[url]) { mongo[url] = null };
    mongo[url] = mongo[url] || require('./_db')(url);
    let prefix = mongo[url].urlToTable(url);

    if (!CupomSchema[url]) {
        CupomSchema[url] = mongo[url].Schema({
            _id: { type: mongo[url].Schema.ObjectId, auto: true },
            codigoCupom: { type: String, required: true, trim: true, index: true, unique: true },
            origemCupom: { type: String, required: true, trim: true },
            tipoDesconto: { type: String, required: true, trim: true },
            valorDesconto: { type: Number, required: true, default: 0 },
            percentualDesconto: { type: Number, required: true, default: 0 },
            valorDescontoMatricula: { type: Number, required: true, default: 0 },
            percentualDescontoMatricula: { type: Number, required: true, default: 0 },
            validoAte: { type: Date, required: true },
            eValido: { type: Boolean, required: true, index: true, default: true },
            quantidadeUsos: { type: Number, required: false, default: -1 },
        }, { versionKey: false, _id: false }); // _id=false impede criar objectid em memoria antes de salvar
    }

    model[url] = model[url] || mongo[url].model('cupom' + url, CupomSchema[url], prefix + 'cupom');

    if (initialize) initializeCupons(model[url])

    return model[url]
}




function initializeCupons(model) {
    var nc = {
        codigoCupom: 'FANTASTICO',
        origemCupom: 'Luiz Gustavo',
        tipoDesconto: 'valor',
        valorDesconto: 2400.00,
        percentualDesconto: 0,
        valorDescontoMatricula: 0,
        percentualDescontoMatricula: 0,
        validoAte: '2018-06-30 00:00:00.000',
        eValido: true,
        quantidadeUsos: -1
    }

    model.findOneAndUpdate({ codigoCupom: nc.codigoCupom }, // find a document with that filter
        nc, // document to insert when nothing was found
        { upsert: true, new: false, runValidators: true }, // options
        function(err, alunos) { // callback
            if (err) {
                console.log('fudeu ' + JSON.stringify(err));
            }
        });

    nc = {
        codigoCupom: 'MALUCON',
        origemCupom: 'Luiz Gustavo',
        tipoDesconto: 'percentual',
        valorDesconto: 0,
        percentualDesconto: .6,
        valorDescontoMatricula: 0,
        percentualDescontoMatricula: 0,
        validoAte: '2018-06-30 00:00:00.000',
        eValido: true,
        quantidadeUsos: -1
    }

    model.findOneAndUpdate({ codigoCupom: nc.codigoCupom }, // find a document with that filter
        nc, // document to insert when nothing was found
        { upsert: true, new: false, runValidators: true }, // options
        function(err, alunos) { // callback
            if (err) {
                console.log('fudeu ' + JSON.stringify(err));
            }
        });
}