import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-expense-view',
  templateUrl: 'expense-view.html',
})
export class ExpenseViewPage {

  public expense: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.expense = this.navParams.get('Expense');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpenseViewPage');
  }

}
