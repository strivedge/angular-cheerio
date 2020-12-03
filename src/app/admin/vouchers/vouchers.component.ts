import {Component, OnDestroy} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators' ;
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../@core/data/smart-table';
import { ApiService } from '../../@core/mock/api.service';
import { RIGHT_ARROW } from '@angular/cdk/keycodes';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'ngx-vouchers',
  styleUrls: ['./vouchers.component.scss'],
  templateUrl: './vouchers.component.html',
})

export class VouchersComponent implements OnDestroy {

  profileForm = new FormGroup({
    _id: new FormControl(''),
    title: new FormControl('', Validators.required),
    icon: new FormControl('', Validators.required),
    vouchertype: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    credits: new FormControl('', Validators.required),
    codes: new FormControl([]),
    //status: new FormControl('', Validators.required),
  });

  showListing = false;
  showAddForm = false;
  showEditForm = false;
  vouchers: any;
  icon1: any;
  code: any;
  editId = 0;
  codes = [];

  settings = {
    mode: 'external',
    columns: { 

      icon: {
        title: 'Image',
        type: 'html',
        filter: false,        
        valuePrepareFunction: (value) => { 
          if(value){
            return '<img width="50" class="list-img" src="'+value+'" />' 
          }else{
            return '<img width="50 class="list-img" src="assets/images/kitten-dark.png" />' 
          }          
        }
      },     
      title: {
        title: 'Title',
        type: 'string',
      },
      vouchertype: {
        title: 'Type',
        type: 'string',
      }      
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
    this.showListing = true;
    this.apiService.getVouchers().subscribe((response) => {
      this.vouchers = response.data.docs;
      this.source.load(this.vouchers);
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
      icon: reader.result
    });
  }
    
  createVoucher(): void {

    this.showListing = false;
    this.showAddForm = true;
    this.showEditForm = false;

    this.editId = 0;
    this.code = "";
    this.icon1 = "";
    this.codes = [];

    this.profileForm.patchValue({
      _id: "",
      title: "",
      icon: "",
      vouchertype: "Featured",
      description: "",
      credits: "",
      status: "",
      codes:[]
    });
  }

  editVoucher(event): void {
    var row = event.data;
    this.showListing = false;
    this.showAddForm = false;
    this.showEditForm = true;

    this.editId = row._id;
    this.code = "";
    this.icon1 = row.icon;
    this.codes = row.codes;

    this.profileForm.patchValue({
      _id: row._id,
      title: row.title,
      icon: row.icon,
      vouchertype: row.vouchertype,
      description: row.description,
      credits: row.credits,
      status: row.status,      
    });

  }

  resetListing(){
    this.showListing = true;
    this.showAddForm = false;
    this.showEditForm = false;
  }

  removeCode(code){

    var params = {
      _id: this.editId,
      code: code,
      action: "remove"
    }

    this.apiService.addremVoucherCode(params).subscribe((response) => {
      this.code = "";
      this.codes = response.data;
    }),
    (err: any) => console.log(err),
    () => {}
    ;
  }

  addCode(){

    var params = {
      _id: this.editId,
      code: this.code,
      action: "add"
    }

    this.apiService.addremVoucherCode(params).subscribe((response) => {
      this.code = "";
      this.codes = response.data;
    }),
    (err: any) => console.log(err),
    () => {}
    ;
  }

  onCreateConfirm(event): void {

    var params = this.profileForm.value;
    delete params._id;
    this.apiService.saveVoucher(params).subscribe((response) => {
      this.resetListing();
      this.apiService.getVouchers().subscribe((response) => {
        this.vouchers = response.data.docs;
        this.source.load(this.vouchers);
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
    this.apiService.editVoucher(params).subscribe((response) => {
      this.resetListing();
      this.apiService.getVouchers().subscribe((response) => {
        this.vouchers = response.data.docs;
        this.source.load(this.vouchers);
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
      this.apiService.deleteVoucher(row._id).subscribe((response) => {
        this.apiService.getVouchers().subscribe((response) => {
          this.vouchers = response.data.docs;
          this.source.load(this.vouchers);
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
