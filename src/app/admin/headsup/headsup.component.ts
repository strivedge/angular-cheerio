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

@Component({
  selector: 'ngx-quiz',
  styleUrls: ['./headsup.component.scss'],
  templateUrl: './headsup.component.html',
})

export class HeadsupComponent implements OnDestroy {

  importForm = new FormGroup({
    csvData: new FormControl('', Validators.required),
  });

  profileForm = new FormGroup({
    _id: new FormControl(''),
    topic: new FormControl(''),
    question: new FormControl('', Validators.required),
    option_1_text: new FormControl('', Validators.required),
    option_1_value: new FormControl('', Validators.required),
  });

  showListing = false;
  showAddForm = false;
  showEditForm = false;
  showImport = false;
  questions: any;
  topics: any;
  csvData: any;
  headerData: any;
  rowData: any;
  tampData: [];
  topic: any;

  settingCsv = {
    pager: {
      display: true,
      perPage: 50
    },
    actions:{
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      question: {
        title: 'Question',
        filter: false
      },
      answer: {
        title: 'Answer',
        filter: false
      },
     
    }
  };

  settings = {
    mode: 'external',
    columns: {     
          
      question: {
        title: 'Question',
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
  source1: LocalDataSource = new LocalDataSource();

  constructor(private themeService: NbThemeService, private service: SmartTableData, private apiService: ApiService, private _sanitizer: DomSanitizer, private sanitizer: DomSanitizer) { 

    this.showListing = true;
    this.topic = {topic:'heads_up'};
    this.apiService.getTopicQuestion(this.topic).subscribe((response) => {
      //console.log(response)
      this.questions = response.data;
      //console.log(this.questions);
      this.source.load(this.questions);
    }),
    (err: any) => console.log(err),
    () => {}
    ;
    
  } 

  ngOnDestroy() {
  }  

  importQuestion(): void {

    this.showListing = false;
    this.showAddForm = false;
    this.showEditForm = false;
    this.showImport = true;
    this.importForm.patchValue({
      csvData: ""     
    });
    this.csvData = [];
    this.headerData = [];
    this.rowData = [];

    this.source1.load([]);
  }
    
  createQuestion(): void {

    this.showListing = false;
    this.showAddForm = true;
    this.showEditForm = false;
    this.showImport = false;

    this.profileForm.patchValue({
      _id: "",
      topic: 'heads_up',
      question: "",
      option_1_text: "",
      option_1_value: true,
    });
  }

  editQuestion(event): void {
    
    var row = event.data;
    this.showListing = false;
    this.showAddForm = false;
    this.showEditForm = true;
    this.showImport = false;

    this.profileForm.patchValue({
      _id: row._id,
      topic: 'heads_up',
      question: row.question,
      option_1_text: row.option_1_text,
      option_1_value: row.option_1_value,
    });

  }

  chkAnswer(event){

    this.profileForm.patchValue({
      topic: 'heads_up',
      option_1_value: false,
    }); 

  }

  resetListing(){
    this.showListing = true;
    this.showAddForm = false;
    this.showEditForm = false;
    this.showImport = false;
  }

  // Image Preview
  uploadCSVFile(event) {
    
    const file = (event.target as HTMLInputElement).files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (event: any) => {

      var csv = event.target.result; // Content of CSV file   
        
      var lines = csv.split("\n");     
      console.log('data',lines) 

      for(var i=0;i<lines.length;i++){
        var line = lines[i];
        var data = line.split(",");
        console.log('data',data)
        var row = [];
        for(var j=0;j<data.length;j++){         
          if(i == 0){
            let hd = data[j].replace(/\s/g, "");
            var res = hd.toLowerCase();
            this.headerData.push(res)
            this.headerData.push('topic') 
            //console.log("headerData",this.headerData)
          }else{
            row.push(data[j]);
            row.push('heads_up');
          }          
        }  
        
        if(i != 0){ 
          this.rowData.push(row);
          //console.log("rowData",this.rowData)
        }
      }

      let rrrr = [];
      for(var k=0; k < this.rowData.length;k++){
        let rrr = {push:function push(element){ [].push.call(this,element)}};
        for(var l=0; l < this.headerData.length;l++){
            var hData =  this.headerData[l];
            var rData = this.rowData[k][l];
            //console.log("\n hData >>>>>>> ",hData);
            //console.log("\n rData >>>>>>> ",rData);
            if(rData && typeof rData != undefined && rData != ""){
              //console.log(hData);
              if(hData == "answer" && rData){
                var res = rData.toLowerCase();
                res = res.replace(/\r/g, '');
                rrr[hData] = res;
              }else{
                rrr[hData] = rData;
              }              
            }            
        } 

        if(rrr.hasOwnProperty("topic") && rrr.constructor === Object){
          rrrr.push(rrr)
        }
        
      }

      if(rrrr.length > 0){
        //console.log('rrrr',rrrr);
        this.csvData = rrrr;
        this.source1.load(rrrr);
        this.importForm.patchValue({
          csvData: "1"     
        });
      }
      
      
    }
  }

  onImportConfirm(event): void {
    //console.log("Final this.csvData",this.csvData)

    this.apiService.importQuestions(this.csvData).subscribe((response) => {

      //console.log("importQuestions",response)

      this.resetListing();
      this.topic = {topic:'heads_up'};
      this.apiService.getTopicQuestion(this.topic).subscribe((response) => {
      //console.log(response)
      this.questions = response.data;
        this.source.load(this.questions);
      }),
      (err: any) => console.log(err),
      () => {}
      ;

    }),
    (err: any) => console.log(err),
    () => {}
    ;

  }

  onCreateConfirm(event): void {

    var params = this.profileForm.value;    
    delete params._id;
    this.topic = {topic:'heads_up'};
    this.apiService.saveQuestion(params).subscribe((response) => {
      this.resetListing();
      this.apiService.getTopicQuestion(this.topic).subscribe((response) => {
        console.log("Create save",response)
        this.questions = response.data;
        this.source.load(this.questions);
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
    this.topic = {topic:'heads_up'};
    this.apiService.editQuestion(params).subscribe((response) => {
      this.resetListing();
      this.apiService.getTopicQuestion(this.topic).subscribe((response) => {
        this.questions = response.data;
        this.source.load(this.questions);
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
      this.topic = {topic:'heads_up'};
      this.apiService.deleteQuestion(row._id).subscribe((response) => {
        this.apiService.getTopicQuestion(this.topic).subscribe((response) => {
          this.questions = response.data;
          this.source.load(this.questions);
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