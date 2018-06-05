var express = require('express');
var router = express.Router();
const Vindi = require('vindi-js');

const cVindi = new Vindi('QzaLFAj4fOwgEjgNeDzOZzKtk40ygxxjhZ0xvMj0yU8');

const PRODUCT_ID_PADRAO = 215139
const PRODUCT_ID_PADRAO_MATRICULA = 196780;


router.post("/inscrever", function(req, res) {
    var alunos = require('../../model/ultra-pos/alunos')(req.hostname);
    const al = req.body.aluno;
    const cu = req.body.curso;
    console.log("Salvar : " + al.cpf);
    console.log("Salvar : ", al);
    if (al.celular === '') {
        al.celular = al.whatsapp
    }
    let ret = {};

    alunos.findOneAndUpdate({ cpf: al.cpf }, // find a document with that filter
        al, // document to insert when nothing was found
        { upsert: true, new: false, runValidators: true }, // options
        function(err, alunos) { // callback
            if (err) {
                console.log('fudeu ' + JSON.stringify(err));
                res.send(err);
            } else {
                let cliVindi = {
                    "id": null,
                    "name": al.nome,
                    "email": al.email,
                    "registry_code": al.cpf.replace(/\D/gmi, ''),
                    "code": al.cpf,
                    "notes": "",
                    "status": "active",
                    "address": {
                        "street": al.endereco,
                        "number": al.numero,
                        "additional_details": al.complemento,
                        "zipcode": al.cep.replace(/\D/gmi, ''),
                        "neighborhood": al.bairro,
                        "city": al.cidade,
                        "state": al.uf,
                        "country": 'BR'
                    },
                    "phones": [{
                        "phone_type": "mobile",
                        "number": al.whatsapp.replace(/\D/gmi, ''),
                        "extension": null
                    }, {
                        "phone_type": "mobile",
                        "number": al.celular.replace(/\D/gmi, ''),
                        "extension": null
                    }]
                };
                cVindi.get({ uri: '/api/v1/customers', debug: false }, 'registry_code:' + cliVindi.registry_code).then((clis) => {
                    if (clis.customers.length > 0) { // Cliente Encontrado
                        //res.send(cli.customers[0]);
                        const cli = clis.customers[0];
                        cliVindi.id = cli.id;
                        console.log('teste-id:', cliVindi.id);
                        cli.phones.forEach(e => { // deleta os telefones anteriores
                            cliVindi.phones.push({ id: e.id, _destroy: 1 });
                        });
                        cVindi.put({ uri: '/api/v1/customers/' + cli.id, debug: false }, cliVindi).then((clis2) => {
                            console.log('clis2: ', clis2);
                            const cli2 = clis2.customer;
                            ret.cli2 = cli2;
                            gravarDadosCartao(cli2.id, geraFaturamentoImediatoEAssinatura)
                                //geraFaturamentoImediatoEAssinatura(cli2.id);
                        }).catch((err) => {
                            console.error('error', err);
                            res.send(err);
                        });
                    } else { // Cliente Não Encontrado, novo cliente / cadastra
                        cVindi.post({ uri: '/api/v1/customers', debug: false }, cliVindi).then((clis2) => {
                            const cli2 = clis2.customer;
                            console.log('cli2: ', cli2);
                            ret.cli2 = cli2;
                            gravarDadosCartao(cli2.id, geraFaturamentoImediatoEAssinatura)
                                //geraFaturamentoImediatoEAssinatura(cli2.id);
                        }).catch((err) => {
                            console.error('error', err);
                            res.send(err);
                        });
                    }
                }).catch((err) => {
                    console.error('error', err);
                    res.send(err);
                })
            }
        });

    function gravarDadosCartao(idCli, faturar) {
        if (cu.pagamento.formaPagamento === 'cartao') {
            // /api/v1/payment_profiles?page=1&query=customer_id%3A6200271%20card_number_first_six%3A515894%20card_number_last_four%3A5269&sort_by=id&sort_order=asc
            // 'customer_id:' + idCli + ' card_number_first_six:' + first_six + ' card_number_last_four:' + last_four
            const first_six = cu.pagamento.dadosCartao.numero.replace(/\D/gmi, '').substr(0, 6);
            const last_four = cu.pagamento.dadosCartao.numero.replace(/\D/gmi, '').substr(cu.pagamento.dadosCartao.numero.length - 4);
            console.log('customer_id=' + idCli + ' and card_number_first_six=' + first_six)
            cVindi.get({
                uri: '/api/v1/payment_profiles',
                debug: false
            }, 'customer_id=' + idCli + ' and card_number_first_six=' + first_six + ' and card_number_last_four=' + last_four).then((aPaym) => { //, 'customer_id:' + idCli + '+card_number_first_six:' + first_six
                const paym = aPaym.payment_profiles;
                console.log('paym: ', paym);
                if (paym.length == 0) {
                    const cartao_credito = {
                        "holder_name": cu.pagamento.dadosCartao.nome,
                        "card_expiration": cu.pagamento.dadosCartao.vencimento_formatado,
                        "card_number": cu.pagamento.dadosCartao.numero.replace(/\D/gmi, ''),
                        "card_cvv": cu.pagamento.dadosCartao.CVV,
                        "payment_method_code": "credit_card",
                        "payment_company_code": cu.pagamento.dadosCartao.bandeira.toLowerCase().replace(' ', '_'),
                        "customer_id": idCli
                    }
                    cVindi.post({ uri: '/api/v1/payment_profiles', debug: false }, cartao_credito).then((cart) => {
                        console.log('cart: ', cart);
                        ret.paym = cart;
                        idCartao = cart.payment_profile.id;
                        faturar(idCli, idCartao)
                    }).catch((err) => {
                        console.error('error', err);
                        res.send(err);
                    });
                } else {
                    ret.paym = paym;
                    idCartao = paym[0].payment_profile.id;
                    faturar(idCli, idCartao)
                }
                return;
            }).catch((err) => {
                console.error('error', err);
                res.send(err);
            });
        } else {
            faturar(idCli);
        }
    }

    function geraFaturamentoImediatoEAssinatura(idCli, idCartao) {
        const dias = cu.pagamento.formaPagamento === 'cartao' ? 0 : 7;
        let cobrarEm = new Date(cu.pagamento.formaPagamento === 'cartao' ? (new Date()) : (new Date()).setHours(23, 59, 59, 999));
        cobrarEm = (new Date(cobrarEm.setDate(cobrarEm.getDate() + dias))); // formato final deve ser "2018-05-10T23:59:59.000-03:00"
        let fatura = {
            "customer_id": idCli,
            "payment_method_code": cu.pagamento.formaPagamento === 'boleto' ? 'bank_slip' : 'credit_card',
            "due_at": cobrarEm.toISOString().replace('Z', '-03:00'),
            "bill_items": [{
                "product_id": cu.codigo_vindi === null || cu.codigo_vindi <= 0 ? PRODUCT_ID_PADRAO : cu.codigo_vindi, // TIRAR HARD CODE
                "amount": cu.pagamento.valorCobrado / cu.pagamento.parcelamento
            }]
        };

        if (cu.pagamento.formaPagamento === 'cartao') {
            fatura.payment_profile = { id: idCartao };
        }

        if (cu.pagamento.taxaMatricula > 0) {
            fatura.bill_items.push({
                "product_id": PRODUCT_ID_PADRAO_MATRICULA,
                "amount": cu.pagamento.taxaMatricula
            })
        }
        console.log('fatura: ', fatura);
        cVindi.post({ uri: '/api/v1//bills', debug: false }, fatura).then((fat) => {
            ret.fat = fat;
            cobrarEm = cobrarEm; // Ajuste de data
            if (cu.pagamento.parcelamento > 1) {
                let assinatura = {
                    "plan_id": 61639, // HARD CODE
                    "start_at": cobrarEm,
                    "customer_id": idCli,
                    "payment_method_code": cu.pagamento.formaPagamento === 'boleto' ? 'bank_slip' : 'credit_card',
                    "billing_trigger_type": "day_of_month",
                    "billing_trigger_day": cu.pagamento.melhorDia,
                    "billing_cycles": (cu.pagamento.parcelamento - 1),
                    "product_items": [{
                        "product_id": cu.codigo_vindi === null || cu.codigo_vindi <= 0 ? PRODUCT_ID_PADRAO : cu.codigo_vindi,
                        "cycles": (cu.pagamento.parcelamento - 1),
                        "pricing_schema": {
                            "price": cu.pagamento.valorCobrado / cu.pagamento.parcelamento,
                            "schema_type": "flat"
                        }

                    }]
                };
                if (cu.pagamento.formaPagamento === 'cartao') {
                    assinatura.payment_profile = { id: idCartao };
                }
                cVindi.post({ uri: '/api/v1//subscriptions', debug: false }, assinatura).then((sub) => {
                    ret.sub = sub;
                    res.send(ret);
                }).catch((err) => {
                    console.error('error', err);
                    res.send(err);
                });
            } else {
                res.send(ret);
            }
        }).catch((err) => {
            console.error('error', err);
            res.send(err);
        });

    }
});



module.exports = router;