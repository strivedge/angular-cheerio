import {Component, OnDestroy} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators' ;
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../@core/data/smart-table';
import { ApiService } from '../../@core/mock/api.service';
import { RIGHT_ARROW } from '@angular/cdk/keycodes';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-payments',
  styleUrls: ['./payments.component.scss'],
  templateUrl: './payments.component.html',
})

export class PaymentsComponent implements OnDestroy {

  profileForm = new FormGroup({
    _id: new FormControl(''),
    user_name: new FormControl(''),
    plan_id: new FormControl(''),
    amount: new FormControl(''),
    plan_type: new FormControl(''),
    createdAt: new FormControl(''),
  });

  showListing = false;
  showAddForm = false;
  showEditForm = false;
  payments: any;

  settings = {
    mode: 'external',    
    columns: { 

      createdAt: {
        title: 'Date',
        type: 'date',
        valuePrepareFunction: (date) => {
          if (date) {
            return new DatePipe('en-US').transform(date, 'dd-MM-y');
          }
          return null;
        },
      },

      user_data: {
        title: 'User name',
        type: 'string',
        valuePrepareFunction: (value) => { 
          if(value.length > 0){
            return value[0].name ;
          }else{
            return value;
          }            
        }
      },  
      plan_data: {
        title: 'plan name',
        type: 'string',
        valuePrepareFunction: (value) => { 
          if(value.length > 0){
            return value[0].name ;
          }else{
            return value;
          }            
        }
      },
      planType: {
        title: 'play type',
        type: 'string',
      },
      price: {
        title: 'amount',
        type: 'number',
      }         
    },
    actions:{
      add: false,
      delete: false,
      position: 'right',
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private themeService: NbThemeService, private service: SmartTableData, private apiService: ApiService) {  
    this.showListing = true;
    this.apiService.getPayments().subscribe((response) => {
      this.payments = response.data;
      console.log('payments:',this.payments)
      
      this.source.load(this.payments);
      console.log('source',this.source)
    }),
    (err: any) => console.log(err),
    () => {}
    ;
    
  }  

  ngOnDestroy() {
  }

  editUser(event): void {

    var row = event.data;
    this.showListing = false;
    this.showAddForm = false;
    this.showEditForm = true;

    console.log("Row",row)

    this.profileForm.patchValue({
      _id: row._id,
      createdAt: new DatePipe('en-US').transform(row.createdAt, 'dd-MM-y'),
      plan_id: row.plan_data[0].name,
      user_name: row.user_data[0].name,
      amount: row.price,
      plan_type: row.planType,
    });

  }

  resetListing(){
    this.showListing = true;
    this.showAddForm = false;
    this.showEditForm = false;
  } 

}
