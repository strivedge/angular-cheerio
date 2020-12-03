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
  selector: 'ngx-redeems',
  styleUrls: ['./redeems.component.scss'],
  templateUrl: './redeems.component.html',
})

export class RedeemsComponent implements OnDestroy {

  profileForm = new FormGroup({
    _id: new FormControl(''),
    name: new FormControl('', Validators.required),
  });

  showListing = false;
  showAddForm = false;
  showEditForm = false;
  redeems: any;

  settings = {
    mode: 'external',
    columns: { 
    
      name: {
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
    this.showListing = true;
    this.apiService.getRedeems().subscribe((response) => {
      this.redeems = response.data.docs;
      this.source.load(this.redeems);
    }),
    (err: any) => console.log(err),
    () => {}
    ;
    
  }  

  ngOnDestroy() {
  }

  
    
  createCategory(): void {
    this.showListing = false;
    this.showAddForm = true;
    this.showEditForm = false;
    this.profileForm.patchValue({
      _id: "",
      name: "",
    });
  }

  editCategory(event): void {
    var row = event.data;
    this.showListing = false;
    this.showAddForm = false;
    this.showEditForm = true;

    this.profileForm.patchValue({
      _id: row._id,
      name: row.name,
    });

  }

  resetListing(){
    this.showListing = true;
    this.showAddForm = false;
    this.showEditForm = false;
  }

  onChangeType(event): void{
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
    this.apiService.saveRedeem(params).subscribe((response) => {
      this.resetListing();
      this.apiService.getRedeems().subscribe((response) => {
        this.redeems = response.data.docs;
        this.source.load(this.redeems);
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
    this.apiService.editRedeem(params).subscribe((response) => {
      this.resetListing();
      this.apiService.getRedeems().subscribe((response) => {
        this.redeems = response.data.docs;
        this.source.load(this.redeems);
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
      this.apiService.deleteRedeem(row._id).subscribe((response) => {
        this.apiService.getRedeems().subscribe((response) => {
          this.redeems = response.data.docs;
          this.source.load(this.redeems );
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
