// import * as ObjectId from 'objectid-purejs';
// var ObjectId = require('objectid-purejs')

import * as ObjectId from 'objectid-purejs';

export class Cupom {
  public _id:string = (new ObjectId()).toHexString();
  public codigoCupom:string = '';
  public origemCupom:string = '';
  public tipoDesconto:string = 'percentual';
  public validoAte:string = '';
  public eValido:boolean = true;
  public valorDesconto:number = 0;
  public percentualDesconto:number = 0;
  public valorDescontoMatricula:number = 0;
  public percentualDescontoMatricula:number = 0;
  public quantidadeUsos:number = -1;

  constructor(o = null){
    if(o){
      this._id = o._id || this._id;
      this.codigoCupom = o.codigoCupom || this.codigoCupom;
      this.origemCupom = o.origemCupom || this.origemCupom;
      this.tipoDesconto = o.tipoDesconto || this.tipoDesconto;
      this.validoAte = o.validoAte || this.validoAte;
      this.eValido = o.eValido || this.eValido;
      this.valorDesconto = o.valorDesconto || this.valorDesconto;
      this.percentualDesconto = o.percentualDesconto || this.percentualDesconto;
      this.valorDescontoMatricula = o.valorDescontoMatricula || this.valorDescontoMatricula;
      this.percentualDescontoMatricula = o.percentualDescontoMatricula || this.percentualDescontoMatricula;
      this.quantidadeUsos = o.quantidadeUsos || this.quantidadeUsos;
    }
  }
}

