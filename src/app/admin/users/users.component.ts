import {Component, OnDestroy} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators' ;
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../@core/data/smart-table';
import { ApiService } from '../../@core/mock/api.service';
import { RIGHT_ARROW } from '@angular/cdk/keycodes';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { environment } from "../../../../src/environments/environment";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-users',
  styleUrls: ['./users.component.scss'],
  templateUrl: './users.component.html',
})

export class UsersComponent implements OnDestroy {

  profileForm = new FormGroup({
    _id: new FormControl(''),
    facebook_id: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    picture: new FormControl(''),
    mobile: new FormControl(''),
    fcm_token: new FormControl(''),
    credits: new FormControl(''),
    drinks: new FormControl(''),
    bottom_up: new FormControl(''),
    round_up: new FormControl(''),
    ratings: new FormControl(''),
    level: new FormControl(''),
    display_email: new FormControl(''),
    display_mobile: new FormControl(''),
    profile_complete: new FormControl(''),
    plan: new FormControl(''),
    start_date: new FormControl(''),
    end_date: new FormControl(''),
    paid_amount: new FormControl('')
  });

  showListing = false;
  showAddForm = false;
  showEditForm = false;
  users: any;

  imagPath = environment.imagePath;

  settings = {
    mode: 'external',
    columns: { 

      picture: {
        title: 'Image',
        type: 'html',
        filter: false,        
        valuePrepareFunction: (value) => { 
          if(value){
            var imgPath = environment.imagePath + value;
            return '<img width="50" class="list-img" src="'+imgPath+'" />' 
          }else{
            return '<img width="50 class="list-img" src="assets/images/kitten-dark.png" />' 
          }          
        }
      },     
      name: {
        title: 'Name',
        type: 'string',
      },
      plan_data: {
        title: 'Plan',
        type: 'string',
        valuePrepareFunction: (value) => { 
          console.log(value)
          if(value.length > 0){
            return value[0].name;
          }else{
            return "Free Subscriptoin"
          }
        }
      }, 
      credits: {
        title: 'Credits',
        type: 'string',
        filter: false,
      },         
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
    this.apiService.getUsersList().subscribe((response) => {
      this.users = response.data;
      console.log("Users",this.users)
      this.source.load(this.users);
    }),
    (err: any) => console.log(err),
    () => {}
    ;
    
  }  

  ngOnDestroy() {
  } 
    
  createUser(): void {
    this.showListing = false;
    this.showAddForm = true;
    this.showEditForm = false;
    this.profileForm.patchValue({
      _id: "",
      name: "",
      picture: ""
    });
  }

  editUser(event): void {
    var row = event.data;
    this.showListing = false;
    this.showAddForm = false;
    this.showEditForm = true;
    var country_code = '';
    if(row.country_code){
      country_code = row.country_code +" ";
    }
    if(row.plan_id != "Free Subscriptoin"){
      row.plan_id = row.plan_data[0].name;
    }
    console.log("User data",row)
    //console.log("end_date",new DatePipe('en-US').transform(row.end_date, 'dd-MM-y HH:mm:ss'))

    this.profileForm.patchValue({
      _id: row._id,
      name: row.name,
      picture: row.picture,
      facebook_id: row.facebook_id,
      email: row.email,
      mobile: country_code + row.mobile,
      fcm_token: row.fcm_token,
      credits: row.credits,
      drinks: row.drinks,
      bottom_up: row.bottom_up,
      round_up: row.round_up,
      ratings: row.ratings,
      level: row.level,
      display_email: row.display_email,
      display_mobile: row.display_mobile,
      profile_complete: row.profile_complete,
      plan: row.plan_id,
      start_date: new DatePipe('en-US').transform(row.start_date, 'dd-MM-y HH:mm:ss'),
      end_date: new DatePipe('en-US').transform(row.end_date, 'dd-MM-y HH:mm:ss'),
      paid_amount: row.paid_amount.toFixed(2),
    });

  }

  resetListing(){
    this.showListing = true;
    this.showAddForm = false;
    this.showEditForm = false;
  }

  onCreateConfirm(event): void {

    var params = this.profileForm.value;
    delete params._id;
    this.apiService.saveUser(params).subscribe((response) => {
      this.resetListing();
      this.apiService.getUsersList().subscribe((response) => {
        this.users = response.data;
        this.source.load(this.users);
      }),
      (err: any) => console.log(err),
      () => {}
      ;
    }),
    (err: any) => console.log(err),
    () => {}
    ;
  }

  onEditConfirm(event): void {
    var params = this.profileForm.value;
    this.apiService.editUser(params).subscribe((response) => {
      this.resetListing();
      this.apiService.getUsersList().subscribe((response) => {
        this.users = response.data;
        this.source.load(this.users);
      }),
      (err: any) => console.log(err),
      () => {}
      ;
    }),
    (err: any) => console.log(err),
    () => {}
    ;
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      var row = event.data;
      this.apiService.deleteCategory(row._id).subscribe((response) => {
        this.apiService.getUsersList().subscribe((response) => {
          this.users = response.data;
          this.source.load(this.users);
        }),
        (err: any) => console.log(err),
        () => {}
        ;
      }),
      (err: any) => console.log(err),
      () => {}
      ;      
    }
  }

  
}
