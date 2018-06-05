import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { Cupom } from './models/cupom';
import { Site } from './models/site';

const URL = {
  getDatabases: `${environment.urlApi}/api/util/db/list`,
  getSites: `${environment.urlApi}/api/util/sites/list/cursos`,
  getCupons2 : `${environment.urlApi}/api/cupom/list`,
  getCupons : (d) => `${environment.urlApi}/api/cupom/${d}/list`,
  saveCupons : (d) => `${environment.urlApi}/api/cupom/${d}/save`,
  deleteCupons : (d,id) => `${environment.urlApi}/api/cupom/${d}/delete/${id}`
}

@Injectable()
export class UltraAdminService {

  public bancos:Site[] = [new Site()];
  public bancosAtualizado:BehaviorSubject<any> = new BehaviorSubject<any>(this.bancos);

  public cupons:Map<string,Cupom[]> = new Map<string,Cupom[]>();
  public cupomAtualizado:BehaviorSubject<any> = new BehaviorSubject<any>(this.cupons);

  constructor(
    private http: HttpClient 
  ) {
    //this.cupons.set('',[new Cupom()]);
    this.getDatabases().subscribe((ldb:Site[]) => {
      ldb.forEach((db) => {
        this.getCupons(db.valor).subscribe(() => {});
      })
    })
    //this.getDatabases().subscribe(()=>{});
  }

  getDatabases() {
    return this.http
    .get(URL.getSites)
    .map((d:Site[]) => {
      this.bancos = d;
      this.bancosAtualizado.next(d);
      return d;
    });
  };

  listaCupons(d){
    return this.cupons.get(d);
  }

  getCupons(d){
    return this.http
      .get(URL.getCupons(d))
      .map((c:Cupom[]) => {
        this.cupons.set(d,c);
        this.cupomAtualizado.next(c);
        return c;
      });
  }

  saveCupom(d,c){
    return this.http
      .post(URL.saveCupons(d),c)
      .map((c) => {
        return c;
      });
  }

  deleteCupom(d,c){
    return this.http
      .delete(URL.deleteCupons(d,c._id))
      .map((c) => {
        return c;
      });
  }
}
