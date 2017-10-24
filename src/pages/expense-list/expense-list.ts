import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { ExpenseViewPage } from '../expense-view/expense-view';

@Component({
  selector: 'page-expense-list',
  templateUrl: 'expense-list.html',
})
export class ExpenseListPage {

  public expenseList;
  public filterList;
  public serachInput;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alert:AlertController,
    public loadingCtrl: LoadingController, public apiProvider: ApiProvider) {
    this.filterList = []; //required for virtual scrolling
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpenseListPage');
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();  
    this.apiProvider.getExpense( this.apiProvider.user, this.apiProvider.axUser, this.apiProvider.dataArea ).subscribe((response)=>{
      loading.dismiss();
      this.expenseList = response; 
      this.filterList = response;
    }, (error) => {
      console.log('ERROR'+error);
      loading.dismiss();
      this.alert.create( {title : 'Error', subTitle : 'Please check network connection.', buttons : ['Dismiss']}).present();
    });
  }

  onSearchInput(event:any){
    let val = event.target.value;
    
    if (val && val.trim() != '') {
      this.filterList = this.expenseList.filter( (expense) => {
        return ( expense.ExpenseNumber.toLowerCase().indexOf( val.toLowerCase() ) > -1 ||
        expense.Status.toLowerCase().indexOf( val.toLowerCase() ) > -1 );   
      } );
    }
  }    

  onSearchCancel(event:any){
    console.log('Cancel called');
    //event.target.value = '';
    this.filterList = this.expenseList;
  }

  doRefresh(refresher){
    this.apiProvider.getExpense( this.apiProvider.user, this.apiProvider.axUser, this.apiProvider.dataArea ).subscribe((response)=> {
      this.serachInput = '';
      this.expenseList = response; 
      this.filterList = response;
      refresher.complete();
    });
  }

  itemSelected( item :any ) {
    this.navCtrl.push(ExpenseViewPage, {Expense: item});
  }

}
