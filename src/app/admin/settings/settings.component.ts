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

@Component({
  selector: 'ngx-settings',
  styleUrls: ['./settings.component.scss'],
  templateUrl: './settings.component.html',
})

export class SettingsComponent implements OnDestroy {

  profileForm = new FormGroup({
    _id: new FormControl(''),
    app_name: new FormControl('',Validators.required),
    app_description: new FormControl(''),
    app_version: new FormControl('',Validators.required),
    app_icon: new FormControl('',Validators.required),
    agora_app_id: new FormControl('',Validators.required),
    agora_secret: new FormControl('',Validators.required),
    agora_customer_id: new FormControl('',Validators.required),
    agora_customer_secret: new FormControl('',Validators.required),
    free_month: new FormControl('',Validators.required),
    free_credits: new FormControl('',Validators.required),
    min_interests: new FormControl('',Validators.required),
    min_personalities: new FormControl('',Validators.required),
    amazon_access_key:new FormControl(),
    amazon_secret_key:new FormControl(),
    amazon_partner_id:new FormControl(),
    call_limit:new FormControl(),
  });

  showListing = false;
  showAddForm = false;
  showEditForm = false;
  icon1: any;
  setting: any;
  imagPath = environment.imagePath;

  settings = {
    mode: 'external',
    columns: { 

      app_icon: {
        title: 'Icon',
        type: 'html',
        filter: false,        
        valuePrepareFunction: (value) => { 
          if(value){
            var imgPath = environment.imagePath;
            return '<img width="50" class="list-img" src="'+ (imgPath + value)+'" />' 
          }else{
            return '<img width="50 class="list-img" src="assets/images/kitten-dark.png" />' 
          }            
        }
      },     
      app_name: {
        title: 'Name',
        type: 'string',
        filter: false
      },
                           
    },
    actions:{
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
    
    var imgPath = environment.imagePath;
    this.showListing = false;
    this.showAddForm = false;
    this.showEditForm = true;
    this.apiService.getSettings().subscribe((response) => {
      this.setting = response.data.docs;
      console.log("get settings:",this.setting);
      //this.source.load(this.setting);
      console.log(this.setting.length)

      if(this.setting.length > 0){
        
        var imgPath = environment.imagePath;
        this.icon1 = imgPath+this.setting[0].app_icon;

        console.log('If',imgPath+this.setting[0].app_icon)
        
        this.profileForm.patchValue({
          _id: this.setting[0]._id,
          app_name: this.setting[0].app_name,
          app_description:this.setting[0].app_description,
          app_version:this.setting[0].app_version,
          app_icon: imgPath + this.setting[0].app_icon,
          agora_app_id:this.setting[0].agora_app_id,
          agora_secret:this.setting[0].agora_secret,
          agora_customer_id:this.setting[0].agora_customer_id,
          agora_customer_secret:this.setting[0].agora_customer_secret,
          free_month:this.setting[0].free_month,
          free_credits:this.setting[0].free_credits,
          min_interests:this.setting[0].min_interests,
          min_personalities:this.setting[0].min_personalities,
          amazon_access_key:this.setting[0].amazon_access_key,
          amazon_secret_key:this.setting[0].amazon_secret_key,
          amazon_partner_id:this.setting[0].amazon_partner_id,
          call_limit:this.setting[0].call_limit,
        });
      }else{
        console.log('Else')
        this.icon1 = "";
        
        this.profileForm.patchValue({
          _id: "",
          app_name: "",
          app_description:"",
          app_version:"",
          app_icon: "",
          agora_app_id: "",
          agora_secret:"",
          agora_customer_id:"",
          agora_customer_secret:"",
          free_month:"",
          free_credits:"",
          min_interests:"",
          min_personalities:"",
          amazon_access_key:"",
          amazon_secret_key:"",
          amazon_partner_id:"",
          call_limit:""
        });
      }
      
  
    }),
    (err: any) => console.log(err),
    () => {}
    ;
    
  }  

  ngOnDestroy() {
  }

  // Image Preview
  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    var reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    let reader = e.target;
    this.profileForm.patchValue({
      app_icon: reader.result
    });
  }
    
  createSetting(): void {
    this.showListing = false;
    this.showAddForm = true;
    this.showEditForm = false;
    this.icon1 = "";
    this.profileForm.patchValue({
      _id: "",
      app_name: "",
      app_description:"",
      app_version:"",
      app_icon: "",
      agora_app_id: "",
      agora_secret:"",
      agora_customer_id:"",
      agora_customer_secret:"",
      free_month:"",
      free_credits:"",
      min_interests:"",
      min_personalities:"",
      amazon_access_key:"",
      amazon_secret_key:"",
      amazon_partner_id:"",
      call_limit:""

    });
  }

  editSetting(event): void {
    console.log(event);
    var row = event.data;

    var imgPath = environment.imagePath;
    this.icon1 = imgPath+row.app_icon;
    
    this.showListing = false;
    this.showAddForm = false;
    this.showEditForm = true;

    this.profileForm.patchValue({
      _id: row._id,
      app_name: row.app_name,
      app_description:row.app_description,
      app_version:row.app_version,
      app_icon: row.app_icon,
      agora_app_id:row.agora_app_id,
      agora_secret:row.agora_secret,
      agora_customer_id:row.agora_customer_id,
      agora_customer_secret:row.agora_customer_secret,
      free_month:row.free_month,
      free_credits:row.free_credits,
      min_interests:row.min_interests,
      min_personalities:row.min_personalities,
      amazon_access_key:row.amazon_access_key,
      amazon_secret_key:row.amazon_secret_key,
      amazon_partner_id:row.amazon_partner_id,
    });

  }

  resetListing(){
    this.showListing = false;
    this.showAddForm = false;
    this.showEditForm = true;
  }

  onCreateConfirm(event): void {

    var params = this.profileForm.value;
    delete params._id;
    this.apiService.saveSetting(params).subscribe((response) => {
      this.resetListing();
      this.apiService.getSettings().subscribe((response) => {
        this.setting = response.data.docs;
        this.source.load(this.setting);
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
    this.apiService.editSetting(params).subscribe((response) => {
      this.resetListing();
      this.apiService.getSettings().subscribe((response) => {
        console.log(response)
        this.setting = response.data.docs;
        this.source.load(this.setting);
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
      this.apiService.deleteSetting(row._id).subscribe((response) => {
        this.apiService.getSettings().subscribe((response) => {
          this.setting = response.data.docs;
          this.source.load(this.setting);
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
