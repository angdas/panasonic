import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiProvider } from '../../providers/api/api';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  username: string;
  password: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage,
    public loadingCtrl: LoadingController, private alertCtrl: AlertController, public apiProvider: ApiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.storage.ready().then(() => {
      this.storage.get('panessuser').then(data => {
        this.username = data;
      });
      this.storage.get('panesspassword').then(data => {
        this.password = data;
      });
    });
  }

  doLogin(){
    console.log(this.username+"+"+this.password);
    let loading = this.loadingCtrl.create({
      content: 'Authenticating'
    });
    loading.present();
    this.apiProvider.auth(this.username,this.password).subscribe(res =>{ 
      loading.dismiss();
      this.storage.ready().then(() => {       
        this.storage.set('panessuser', this.username);
        this.storage.set('panesspassword',this.password);
        this.storage.set('panessauthenticated', res.Authenticated); 
        this.storage.set('panessname', res.Worker.Name); 
        this.storage.set('panessimage', res.Worker.ImageStr); 
      });         
      if(res.Authenticated == true) {
        this.navCtrl.setRoot(HomePage);
      } else {
        let alert = this.alertCtrl.create({
          title: 'Login',
          subTitle: 'Please check your credentials.',
          buttons: ['Dismiss']
        }); 
        alert.present();
      }               
    }, (error) => {
      console.log('ERROR'+error);
      loading.dismiss();
      this.alertCtrl.create( {title : 'Error', subTitle : 'Please check network connection.', buttons : ['Dismiss']}).present();
    });
  }
}