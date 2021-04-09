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
  selector: 'ngx-plans',
  styleUrls: ['./plans.component.scss'],
  templateUrl: './plans.component.html',
})

export class PlansComponent implements OnDestroy {

  profileForm = new FormGroup({
    _id: new FormControl(''),
    name: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    planType: new FormControl('', Validators.required),
    credits: new FormControl(''),
    price_per_credit: new FormControl(''),
    months: new FormControl(''),
    price_per_month: new FormControl(''),
    product_id: new FormControl('', Validators.required),
    apple_plan_id: new FormControl('', Validators.required),
    dispaly_plan: new FormControl('')
  });

  showListing = false;
  showAddForm = false;
  showEditForm = false;
  displayType = "credits";
  credits = 0;
  months = 0;
  unit = 0;
  plans: any;

  settings = {
    mode: 'external',
    columns: { 
    
      name: {
        title: 'Plan Name',
        type: 'string',
        filter: false
      },  
      planType: {
        title: 'Plan Type',
        type: 'string',
        filter: false
      }, 
      price: {
        title: 'Price',
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
    this.showListing = true;
    this.displayType="credits";
    this.credits = 0;
    this.months = 0;
    this.apiService.getPlans().subscribe((response) => {
      this.plans = response.data.docs;
      this.source.load(this.plans);
    }),
    (err: any) => console.log(err),
    () => {}
    ;
    
  }  

  ngOnDestroy() {
  }

  
    
  createPlan(): void {
    this.showListing = false;
    this.showAddForm = true;
    this.showEditForm = false;
    this.profileForm.patchValue({
      _id: "",
      name: "",
      planType:"credits",
      price: "",
      credits: "",
      price_per_credit: "",
      months: "",
      price_per_month: "",
      product_id: "",
      apple_plan_id: "",
      dispaly_plan:false,
    });
    this.displayType = "credits";
  }

  editPlan(event): void {
    var row = event.data;
    console.log(row);
    this.showListing = false;
    this.showAddForm = false;
    this.showEditForm = true;

    this.displayType = row.planType;

    this.profileForm.patchValue({
      _id: row._id,
      name: row.name,
      planType:row.planType,
      price: row.price,
      credits: row.credits,
      price_per_credit: row.price_per_credit,
      months: row.months,
      price_per_month: row.price_per_month,
      product_id: row.product_id,
      apple_plan_id:row.apple_plan_id,
      dispaly_plan: row.dispaly_plan,
    });

  }

  resetListing(){
    this.showListing = true;
    this.showAddForm = false;
    this.showEditForm = false;
  }

  onChangeType(event): void{
    this.displayType=event;
  } 

  checkfirstZero(event) {
    const eventName = event.target.name
    const eventValue = event.target.value;
    this.profileForm.patchValue({
      [eventName]: eventValue.replace(/[a-zA-Z]/g, ""),
    });
}

  onCreateConfirm(event): void {
    var params = this.profileForm.value;

    delete params._id;
    this.apiService.savePlan(params).subscribe((response) => {
      this.resetListing();
      this.apiService.getPlans().subscribe((response) => {
        this.plans = response.data.docs;
        this.source.load(this.plans);
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
    this.apiService.editPlan(params).subscribe((response) => {
      this.resetListing();
      this.apiService.getPlans().subscribe((response) => {
        this.plans = response.data.docs;
        this.source.load(this.plans);
      }),
      (err: any) => console.log(err),
      () => {}
      ;
    }),
    (err: any) => console.log(err),
    () => {}
    ;
  }

  dispaly_plan(event){

    this.profileForm.patchValue({
      //dispaly_plan: false, 
    }); 
  }


  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      var row = event.data;
      this.apiService.deletePlan(row._id).subscribe((response) => {
        this.apiService.getPlans().subscribe((response) => {
          this.plans = response.data.docs;
          this.source.load(this.plans );
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
