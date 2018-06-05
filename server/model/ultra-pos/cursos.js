var mongo = {};
var model = {};
var LinguagemSchema = {};
var ImagesSchema = {};
var CategoriesSchema = {};
var VariantSchema = {};
var CursosSchema = {};

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

    if (!ImagesSchema[url]) {
        ImagesSchema[url] = mongo[url].Schema({
            id: { type: Number, required: true, trim: true },
            product_id: { type: Number, required: true, trim: true },
            src: { type: String, required: true, trim: true },
            height: { type: Number, required: true, trim: true },
            position: { type: String, required: true, trim: true },
            en: { type: String, required: true, trim: true },
            alt: [LinguagemSchema[url]],
            created_at: { type: String, trim: true },
            updated_at: { type: String, trim: true },
        }, { versionKey: false, _id: true });
    }

    if (!CategoriesSchema[url]) {
        CategoriesSchema[url] = mongo[url].Schema({
            id: { type: Number, required: true, trim: true },
            name: LinguagemSchema[url],
            description: LinguagemSchema[url],
            handle: LinguagemSchema[url],
            parent: { type: Number, trim: true },
            subcategories: [],
            seo_title: LinguagemSchema[url],
            seo_description: LinguagemSchema[url],
            created_at: { type: String, trim: true },
            updated_at: { type: String, trim: true },
        }, { versionKey: false, _id: true });
    }

    if (!VariantSchema[url]) {
        VariantSchema[url] = mongo[url].Schema({
            id: { type: Number, required: true, trim: true, index: true }, //, unique: true 
            image_id: { type: Number, required: false, trim: true },
            product_id: { type: Number, required: true, trim: true },
            position: { type: Number, required: true, trim: true },
            price: { type: Number, required: true, trim: true },
            down_payment: { type: Number, required: false, trim: true, default: 0 },
            max_payments: { type: Number, required: false, trim: true, default: 24 },
            promotional_price: { type: Number, required: false, trim: true },
            stock_management: { type: Boolean, required: true, trim: true },
            stock: { type: Number, required: false, trim: true },
            weight: { type: Number, required: true, trim: true },
            width: { type: Number, required: false, trim: true },
            height: { type: Number, required: false, trim: true },
            depth: { type: Number, required: false, trim: true },
            sku: { type: String, required: false, trim: true },
            values: [LinguagemSchema[url]],
            barcode: { type: String, required: false, trim: true },
            created_at: { type: String, trim: true },
            updated_at: { type: String, trim: true },
        }, { versionKey: false, _id: true });
    }

    if (!CursosSchema[url]) {
        CursosSchema[url] = mongo[url].Schema({
            id: { type: Number, required: true, trim: true, index: true, unique: true },
            name: LinguagemSchema[url],
            description: LinguagemSchema[url],
            handle: LinguagemSchema[url],
            attributes: [LinguagemSchema[url]],
            published: { type: Boolean, required: true, trim: true, index: true },
            free_shipping: { type: Number, required: true, trim: true, index: true, default: 0 },
            canonical_url: { type: String, required: false, trim: true },
            seo_title: LinguagemSchema[url],
            seo_description: LinguagemSchema[url],
            brand: LinguagemSchema[url],
            created_at: { type: String, required: false, trim: true },
            updated_at: { type: String, required: false, trim: true },
            variants: [VariantSchema[url]],
            tags: { type: String, required: false, trim: true },
            images: [ImagesSchema[url]],
            categories: [CategoriesSchema[url]],
            codigo_vindi: { type: Number, required: false, trim: true, index: true },
        }, { versionKey: false, _id: true });
    }



    model[url] = model[url] || mongo[url].model('cursos' + url, CursosSchema[url], prefix + 'cursos');

    if (initialize) initializeCursos(model[url]);

    return model[url];
}



function initializeCursos(model) {

    var na = {
        "id": 21421838,
        "name": {
            "pt": "MBA - TURISMO E HOSPITALIDADE / Pós-Graduação Cândido Mendes"
        },
        "description": {
            "pt": "<p><span style=\"font-family:lucida sans unicode,lucida grande,sans-serif;\"><strong>MBA &ndash; TURISMO E HOSPITALIDADE<br />\r\n<br />\r\nProposta do curso </strong><br />\r\nA melhor compreens&atilde;o da complexidade das rela&ccedil;&otilde;es humanas &eacute; um fator estrat&eacute;gico tanto para a cria&ccedil;&atilde;o de v&iacute;nculos com clientes, al&eacute;m do desenvolvimento de rela&ccedil;&otilde;es pessoais visando melhorar da qualidade de vida nas comunidades. Por isso, administrar um hotel ou um resort exige uma s&eacute;rie de conjuntos de habilidades relacionadas a v&aacute;rias &aacute;reas, como em servi&ccedil;o de recep&ccedil;&atilde;o, fun&ccedil;&otilde;es nos restaurantes, marketing, administra&ccedil;&atilde;o geral e gest&atilde;o.<br />\r\n&nbsp;<br />\r\nPensado nisso, o curso de MBA Executivo em Gest&atilde;o de Turismo e Hospitalidade se prop&otilde;e a oferecer ao participante o conte&uacute;do, conhecimentos e ferramentas para a atua&ccedil;&atilde;o na &aacute;rea de turismo e hospitalidade.<br />\r\n&nbsp;<br />\r\nO curso abrange os processos tecnol&oacute;gicos de planejamento, organiza&ccedil;&atilde;o, opera&ccedil;&atilde;o e avalia&ccedil;&atilde;o de produtos e servi&ccedil;os inerentes ao turismo, hospitalidade e lazer. As atividades compreendidas neste eixo referem-se ao lazer, rela&ccedil;&otilde;es sociais, turismo, eventos e gastronomia, todas integradas ao contexto das rela&ccedil;&otilde;es humanas em diferentes espa&ccedil;os geogr&aacute;ficos e dimens&otilde;es socioculturais, econ&ocirc;micas e ambientais.<br />\r\n&nbsp;<br />\r\n<strong>Objetivo do curso </strong><br />\r\nPossibilitar aos profissionais a atualiza&ccedil;&atilde;o em rela&ccedil;&atilde;o aos conte&uacute;dos e m&eacute;todos na Gest&atilde;o de Turismo e Hospitalidade. Apresentar t&eacute;cnicas que garantam a competitividade empresarial e a efici&ecirc;ncia gerencial. Aperfei&ccedil;oar as compet&ecirc;ncias essenciais aos profissionais para que possam atuar efetivamente junto &agrave;s organiza&ccedil;&otilde;es.<br />\r\n&nbsp;<br />\r\n<strong>P&uacute;blico-alvo </strong><br />\r\nDestina-se aos profissionais formados nos cursos de Gradua&ccedil;&atilde;o, prioritariamente, nas &aacute;reas de Turismo, Hotelaria, Lazer; Gastronomia; Administra&ccedil;&atilde;o; Nutri&ccedil;&atilde;o; Arquitetura e Urbanismo; Comunica&ccedil;&atilde;o Social; Rela&ccedil;&otilde;es P&uacute;blicas; Enfermagem; Educa&ccedil;&atilde;o F&iacute;sica; Sociologia; Antropologia, Planejamento Ambiental e outras &aacute;reas que estabele&ccedil;am interface com a Hospitalidade.<br />\r\n&nbsp;<br />\r\n<strong>&Aacute;rea do conhecimento </strong><br />\r\nCi&ecirc;ncias sociais aplicadas.<br />\r\n<br />\r\n<strong style=\"font-family: &quot;lucida sans unicode&quot;, &quot;lucida grande&quot;, sans-serif;\">Composi&ccedil;&atilde;o do material did&aacute;tico</strong><br />\r\nMaterial escrito<br />\r\nVideoaulas<br />\r\n<br />\r\n<strong>Dura&ccedil;&atilde;o do curso</strong><br />\r\n6 &agrave; 18 meses<br />\r\n<br />\r\n* Para mais informa&ccedil;&otilde;es entre em contato por e-mail com&nbsp;<strong>coordenacao@</strong></span><strong style=\"font-family: &quot;lucida sans unicode&quot;, &quot;lucida grande&quot;, sans-serif;\">espg</strong><span style=\"font-family:lucida sans unicode,lucida grande,sans-serif;\"><strong>.com.br</strong>&nbsp;para receber a ementa completa&nbsp;do curso<strong>.</strong></span></p>\r\n"
        },
        "handle": {
            "pt": "mba-turismo-e-hospitalidade-pos-graduacao-candido-mendes"
        },
        "attributes": [],
        "published": false,
        "free_shipping": false,
        "canonical_url": "https://sieeesp.lojavirtualnuvem.com.br/mba/mba-turismo-e-hospitalidade-pos-graduacao-candido-mendes/",
        "seo_title": {
            "pt": ""
        },
        "seo_description": {
            "pt": ""
        },
        "brand": null,
        "created_at": "2017-09-10T14:03:55+0000",
        "updated_at": "2018-04-02T14:35:48+0000",
        "variants": [{
            "id": 45973036,
            "image_id": null,
            "product_id": 21421838,
            "position": 3,
            "price": "5000.00",
            "promotional_price": "2000.00",
            "stock_management": false,
            "stock": null,
            "weight": "0.000",
            "width": "0.00",
            "height": "0.00",
            "depth": "0.00",
            "sku": null,
            "values": [],
            "barcode": null,
            "created_at": "2017-09-10T14:03:55+0000",
            "updated_at": "2018-04-02T14:35:46+0000"
        }],
        "tags": "",
        "images": [{
            "id": 26295598,
            "product_id": 21421838,
            "src": "https://d26lpennugtm8s.cloudfront.net/stores/567/973/products/arte-mba-turismo-e-hospitalidade1-7e4392986558ca7b5115053462746075-1024-1024.png",
            "position": 1,
            "alt": [],
            "created_at": "2017-09-13T23:44:17+0000",
            "updated_at": "2017-09-18T17:02:51+0000"
        }],
        "categories": [{
                "id": 2250513,
                "name": {
                    "pt": "MBA"
                },
                "description": {
                    "pt": ""
                },
                "handle": {
                    "pt": "mba"
                },
                "parent": null,
                "subcategories": [],
                "seo_title": {
                    "pt": null
                },
                "seo_description": {
                    "pt": null
                },
                "created_at": "2017-09-10T14:01:14+0000",
                "updated_at": "2018-03-22T00:47:18+0000"
            },
            {
                "id": 2250506,
                "name": {
                    "pt": "GESTÃO"
                },
                "description": {
                    "pt": ""
                },
                "handle": {
                    "pt": "gestao"
                },
                "parent": null,
                "subcategories": [],
                "seo_title": {
                    "pt": null
                },
                "seo_description": {
                    "pt": null
                },
                "created_at": "2017-09-10T14:00:23+0000",
                "updated_at": "2018-03-22T03:08:14+0000"
            }
        ]
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