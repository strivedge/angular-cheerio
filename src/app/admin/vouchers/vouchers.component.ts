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
import { environment } from "../../../../src/environments/environment";

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
  showRedeem = false;
  vouchers: any;
  icon1: any;
  code: any;
  editId = 0;
  amount = 0;
  codes = [];
  request_id:any;

  settings = {
    mode: 'external',
    columns: { 

      icon: {
        title: 'Image',
        type: 'html',
        filter: false,        
        valuePrepareFunction: (value) => { 
          if(value){
            var imgPath = environment.imagePath;
            return '<img width="50" class="list-img" src="'+(imgPath + value)+'" />' 
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

  redeem_data = {
    mode: 'external',
    columns: {
      createdAt: {
        title: 'Date',
        type: 'string',
        filter: false,
        valuePrepareFunction: (date) => {
          if (date) {
            return new DatePipe('en-US').transform(date, 'dd-MM-y');
          }
          return null;
        },
      },  
      code: {
        title: 'Code',
        type: 'string',
        filter: false,
      }, 
      voucher_data: {
        title: 'Voucher Name (Type)',
        type: 'string',
        filter: false,
        valuePrepareFunction: (value) => { 
          if(value.length > 0){
            return  value[0].title+" ("+value[0].vouchertype+")" ;
          }else{
            return value;
          }            
        }
      }, 
      // voucher_data: {
      //   title: 'Voucher Type',
      //   type: 'string',
      //   filter: false,
      //   valuePrepareFunction: (value) => { 
      //     if(value.length > 0){
      //       return value[0].vouchertype ;
      //     }else{
      //       return value;
      //     }            
      //   }
      // }, 
      amount: {
        title: 'Price',
        type: 'number',
        filter: false,
      },    
      user_data: {
        title: 'User Name',
        type: 'string',
        filter: false,
        valuePrepareFunction: (value) => { 
          if(value.length > 0){
            return value[0].name ;
          }else{
            return value;
          }            
        }
      },  
      
      
    },
    actions:{
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    }
  };

  code_data = {
    hideSubHeader: true,
    mode: 'external',
    columns: {
      
      code: {
        title: 'Code',
        type: 'string',
        filter: false,
      }, 
      amount: {
        title: 'Amount',
        type: 'number',
        filter: false,
      },    
      gcId: {
        title: 'Amazon GC Id',
        type: 'string',
        filter: false,
      },  
      // status: {
      //   title: 'Status',
      //   type: 'string',
      //   filter: false,
      //   valuePrepareFunction: (value) => { 
      //     if(value == 0){
      //       return 'DeActive' ;
      //     }else{
      //       return 'Active';
      //     }            
      //   }
      // },     
    },
    actions:{
      position: 'right',
      add: false,
      edit: false,
      //delete: false,
    //  custom: [
    //     { name: 'Activate', title: `<i class="fa fa-toggle-on"></i>` },
    //   ],
    },
    // edit: {
    //   editButtonContent: '<i class="fa fa-toggle-on"></i>',
    //   confirmEdit: true,
    // },
    delete: {
      deleteButtonContent: '<i class="nb-close"></i>',
      confirmDelete: true,
    },
    
  };

  source: LocalDataSource = new LocalDataSource();
  redeem_source: LocalDataSource = new LocalDataSource();
  code_source :LocalDataSource = new LocalDataSource();

  constructor(private themeService: NbThemeService, private service: SmartTableData, private apiService: ApiService) {  
    this.showListing = true;
    this.apiService.getVouchers().subscribe((response) => {
      this.vouchers = response.data.docs;
      this.source.load(this.vouchers);
      console.log(this.vouchers)
    }),
    (err: any) => console.log(err),
    () => {}
    ;
    
  }  

  ngOnDestroy() {
  }

  userRedeems(): void {

    this.showListing = false;
    this.showAddForm = false;
    this.showEditForm = false;
    this.showRedeem = true;
    this.apiService.getUserRedeems().subscribe((response) => {
      this.vouchers = response.data;
      this.redeem_source.load(this.vouchers);
      console.log(this.vouchers)
    }),
    (err: any) => console.log(err),
    () => {}
    ;
  
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
    this.amount = 0;
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
    var codes:any;
    var row = event.data;
    this.showListing = false;
    this.showAddForm = false;
    this.showEditForm = true;

    var imgPath = environment.imagePath;

    this.editId = row._id;
    this.amount = row.credits;
    this.code = "";
    this.icon1 = imgPath+row.icon;
    this.codes = row.codes;

    //this.codes = row.codes.filter( h => h.status != 0);


    this.code_source.load(row.codes);

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
    this.showRedeem = false;
    this.apiService.getVouchers().subscribe((response) => {
      this.vouchers = response.data.docs;
      this.source.load(this.vouchers);
      console.log(this.vouchers)
    }),
    (err: any) => console.log(err),
    () => {}
    ;
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
      amount: this.amount
    }

    this.apiService.createGiftCard(params).subscribe((response) => {
      //this.code = "";
      //this.codes = response.data;
      this.apiService.getVoucher(params._id).subscribe((response) => {
        this.vouchers = response.data;
        console.log("createGiftCard",this.vouchers)
        this.code_source.load(this.vouchers.codes);
      }),
      (err: any) => console.log(err),
      () => {}
      ;
    }),
    (err: any) => console.log(err),
    () => {}
    ;
  }

  activeCode(event):void{
    if (window.confirm('Are you sure you want to Activate Code?')) {
      var row = event.data;
      var params = {
        _id: this.editId,
        request_id : row.request_id
      }
      console.log("params",params)
      console.log("row",row)
      this.apiService.deactiveGiftCard(params).subscribe((response) => {
        this.apiService.getVoucher(params._id).subscribe((response) => {
          this.vouchers = response.data;
          console.log("onDeleteCode",this.vouchers)
          this.code_source.load(this.vouchers.codes);
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
  onDeActiveCode(event):void{

    if (window.confirm('Are you sure you want to Cancel code?')) {
      var row = event.data;
      var params = {
        _id: this.editId,
        request_id : row.request_id,
        gc_id : row.gcId
      }
      console.log("params",params)
      console.log("row",row)
      this.apiService.cancelGiftCard(params).subscribe((response) => {
        this.apiService.getVoucher(params._id).subscribe((response) => {
          this.vouchers = response.data;
          console.log("cancelGiftCard",this.vouchers)
          this.code_source.load(this.vouchers.codes);
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
    //console.log("params",params)
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
