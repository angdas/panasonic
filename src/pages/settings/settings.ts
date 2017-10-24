import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiProvider } from '../../providers/api/api';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  locationEnabled: any;
  public server: any;
  public port: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, 
    public apiProvider: ApiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
    this.setServerPort();
  }

  serverChange(){
    this.storage.ready().then(() => {
      this.storage.set("panessserver",this.server);
      this.apiProvider.server = this.server;
      this.apiProvider.setURL();
    });    
  }

  portChange(){
    this.storage.ready().then(() => {
      this.storage.set("panessport",this.port);
      this.apiProvider.port = this.port;
      this.apiProvider.setURL();
    });    
  }

  setServerPort(){ 
    this.storage.ready().then(() => {
      this.storage.get("panessserver").then((data) => {
        this.server = data;       
      });
      this.storage.get("panessport").then((data) => {
        this.port = data;
      });
    });
  }
}