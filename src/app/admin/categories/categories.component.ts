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
  selector: 'ngx-categories',
  styleUrls: ['./categories.component.scss'],
  templateUrl: './categories.component.html',
})

export class CategoriesComponent implements OnDestroy {

  profileForm = new FormGroup({
    _id: new FormControl(''),
    name: new FormControl('', Validators.required),
    picture: new FormControl('', Validators.required),
  });

  showListing = false;
  showAddForm = false;
  showEditForm = false;
  categories: any;
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
            var imgPath = environment.imagePath;
            return '<img width="50" class="list-img" src="'+ (imgPath + value)+'" />' 
          }else{
            return '<img width="50 class="list-img" src="assets/images/kitten-dark.png" />' 
          }       
        }
      },     
      name: {
        title: 'Name',
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
    this.apiService.getCategories().subscribe((response) => {
      console.log(response)
      this.categories = response.data.docs;
      this.source.load(this.categories);
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
      picture: reader.result
    });
  }
    
  createCategory(): void {
    this.showListing = false;
    this.showAddForm = true;
    this.showEditForm = false;
    this.profileForm.patchValue({
      _id: "",
      name: "",
      picture: ""
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
      picture: row.picture
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
    this.apiService.saveCategory(params).subscribe((response) => {
      this.resetListing();
      this.apiService.getCategories().subscribe((response) => {
        this.categories = response.data.docs;
        this.source.load(this.categories);
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
    this.apiService.editCategory(params).subscribe((response) => {
      this.resetListing();
      this.apiService.getCategories().subscribe((response) => {
        this.categories = response.data.docs;
        this.source.load(this.categories);
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
        this.apiService.getCategories().subscribe((response) => {
          this.categories = response.data.docs;
          this.source.load(this.categories);
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
