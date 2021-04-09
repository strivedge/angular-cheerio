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
  styleUrls: ['./notificationlog.component.scss'],
  templateUrl: './notificationlog.component.html',
})

export class NotificationLogComponent implements OnDestroy {

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
  getNotificationLog: any;

  settings = {
    mode: 'external',    
    columns: { 

      createdAt: {
        title: 'Date',
        type: 'date',
        valuePrepareFunction: (date) => {
          if (date) {
            return new DatePipe('en-US').transform(date, 'dd-MM-y H:m:s');
          }
          return null;
        },
      },

      user_name: {
        title: 'User name',
        type: 'string',
      },  
      type: {
        title: 'Type',
        type: 'string',
      }, 
      fcm_token: {
        title: 'User Token',
        type: 'string',
      },  
       
             
    },
    actions:{
      add: false,
      edit: false,
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
    this.apiService.getNotificationLog().subscribe((response) => {
      this.getNotificationLog = response.data.docs;
      console.log('getNotificationLog:',this.getNotificationLog)
      
      this.source.load(this.getNotificationLog);
      console.log('source',this.source)
    }),
    (err: any) => console.log(err),
    () => {}
    ;
    
  }  

  ngOnDestroy() {
  }


  resetListing(){
    this.showListing = true;
    this.showAddForm = false;
    this.showEditForm = false;
  } 

}
