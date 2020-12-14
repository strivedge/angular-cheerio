import {Component, OnDestroy} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators' ;
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../@core/data/smart-table';
import { ApiService } from '../../@core/mock/api.service';
import { RIGHT_ARROW } from '@angular/cdk/keycodes';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { environment } from "../../../../src/environments/environment";

@Component({
  selector: 'ngx-personalities',
  styleUrls: ['./personalities.component.scss'],
  templateUrl: './personalities.component.html',
})

export class PersonalitiesComponent implements OnDestroy {

  profileForm = new FormGroup({
    _id: new FormControl(''),
    question: new FormControl('', Validators.required),
    option_1_icon: new FormControl('', Validators.required),
    option_1_value: new FormControl('', Validators.required),
    option_2_icon: new FormControl('', Validators.required),
    option_2_value: new FormControl('', Validators.required),
  });

  showListing = false;
  showAddForm = false;
  showEditForm = false;
  personalities: any;
  option_1_icon_image: any;
  option_2_icon_image: any;
  imagPath = environment.imagePath;

  settings = {
    mode: 'external',
    columns: {           
      question: {
        title: 'Question',
        type: 'string',
      }   ,
      option_1_icon: {
        title: 'Option 1',
        type: 'html',
        filter: false,        
        valuePrepareFunction: (value) => { 
          if(value){
            var imgPath = environment.imagePath;
            return '<img width="50" class="list-img" src="'+ (imgPath + value)+'" />' 
          }else{
            return '' 
          }           
        }
      },    
      option_2_icon: {
        title: 'Option 2',
        type: 'html',
        filter: false,        
        valuePrepareFunction: (value) => { 
          if(value){
            var imgPath = environment.imagePath;
            return '<img width="50" class="list-img" src="'+ (imgPath + value)+'" />' 
          }else{
            return '' 
          }         
        }
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

  constructor(private themeService: NbThemeService, private service: SmartTableData, private apiService: ApiService, private _sanitizer: DomSanitizer, private sanitizer: DomSanitizer) { 

    this.showListing = true;
    this.apiService.getPersonalities().subscribe((response) => {
      this.personalities = response.data.docs;
      this.source.load(this.personalities);
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
      option_1_icon: reader.result
    });
  }

  uploadFile1(event) {
    const file = (event.target as HTMLInputElement).files[0];
    var reader = new FileReader();
    reader.onload = this._handleReaderLoaded1.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded1(e) {
    let reader = e.target;
    this.profileForm.patchValue({
      option_2_icon: reader.result
    });
  }
    
  createPersonality(): void {
    this.showListing = false;
    this.showAddForm = true;
    this.showEditForm = false;
    this.profileForm.patchValue({
      _id: "",
      question: "",
      option_1_icon: "",
      option_1_value: "",
      option_2_icon: "",
      option_2_value: "",
    });
  }

  editPersonality(event): void {
    var row = event.data;
    this.showListing = false;
    this.showAddForm = false;
    this.showEditForm = true;

    var imgPath = environment.imagePath;

    this.option_1_icon_image = imgPath+row.option_1_icon;
    this.option_2_icon_image = imgPath+row.option_2_icon;

    this.profileForm.patchValue({
      _id: row._id,
      question: row.question,
      option_1_icon: row.option_1_icon,
      option_1_value: row.option_1_value,
      option_2_icon: row.option_2_icon,
      option_2_value: row.option_2_value,
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
    this.apiService.savePersonality(params).subscribe((response) => {
      this.resetListing();
      this.apiService.getPersonalities().subscribe((response) => {
        this.personalities = response.data.docs;
        this.source.load(this.personalities);
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
    this.apiService.editPersonality(params).subscribe((response) => {
      this.resetListing();
      this.apiService.getPersonalities().subscribe((response) => {
        this.personalities = response.data.docs;
        this.source.load(this.personalities);
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
      this.apiService.deletePersonality(row._id).subscribe((response) => {
        this.apiService.getPersonalities().subscribe((response) => {
          this.personalities = response.data.docs;
          this.source.load(this.personalities);
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