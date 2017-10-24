import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs";
import { Storage } from '@ionic/storage';

@Injectable()
export class ApiProvider {

  public server: any;
  public port: any;
  public url;
  public user;
  public axUser;
  public dataArea;
  private loginURL;
  private getExpenseURL;

  constructor(public http: Http, public storage: Storage) {
    console.log('Hello AxServiceProvider Provider');
    this.setServerPort();
  }

  setServerPort(){ 
    this.storage.ready().then(() => {
      this.storage.get("panessserver").then((data) => {
        this.server = data;
        this.setURL();            
      });
      this.storage.get("panessport").then((data) => {
        this.port = data;
        this.setURL(); 
      });
    });

    this.setURL();
  }

  setURL(){
    this.url = 'http://'+this.server+':'+this.port+'/AFZPOCWebAPI/';
    this.loginURL = this.url + 'checkuser';
    this.getExpenseURL = this.url + 'getExpenseAll';

  }

  auth(user:string, password: string): Observable<any>{
    let body = {UserId: user, Password: password};
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.loginURL,JSON.stringify(body), options)
    .map(this.extractData)
    .catch(this.handleError);
  }

  getExpense(user:string, axuser:string, dataArea:string): Observable<any>{
    let body = {UserId: user, Worker: {AxUser: axuser}, DataArea: {DataAreaId: dataArea}};
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.getExpenseURL,JSON.stringify(body), options)
    .map(this.extractData)
    .catch(this.handleError);
  }

  private extractData(res: Response) { 
    return res.json() || { };
  }
    
  private handleError (error: Response | any) { 
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  } 

}