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
  styleUrls: ['./quiz.component.scss'],
  templateUrl: './quiz.component.html',
})

export class QuizComponent implements OnDestroy {

  importForm = new FormGroup({
    csvData: new FormControl('', Validators.required),
  });

  profileForm = new FormGroup({
    _id: new FormControl(''),
    topic: new FormControl('', Validators.required),
    question: new FormControl('', Validators.required),
    option_1_text: new FormControl('', Validators.required),
    option_1_value: new FormControl('', Validators.required),
    option_2_text: new FormControl('', Validators.required),
    option_2_value: new FormControl('', Validators.required),
    option_3_text: new FormControl('', Validators.required),
    option_3_value: new FormControl('', Validators.required),
    option_4_text: new FormControl('', Validators.required),
    option_4_value: new FormControl('', Validators.required)
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
      topic: {
        title: 'Topic',
        filter: false
      },
      question: {
        title: 'Question',
        filter: false
      },
      option_1: {
        title: 'Option 1',
        filter: false
      },
      option_2: {
        title: 'Option 2',
        filter: false
      },
      option_3: {
        title: 'Option 3',
        filter: false
      },
      option_4: {
        title: 'Option 4',
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
      topic: {
        title: 'Topic',
        type: 'string'
      } ,      
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
    this.apiService.getTriviaQuestions().subscribe((response) => {
      this.questions = response.data;
      //console.log(this.questions);
      this.source.load(this.questions);
    }),
    (err: any) => console.log(err),
    () => {}
    ;

    var params =  "name=Trivia";

    this.apiService.getGames(params).subscribe((response) => {
      if(response.data.docs && response.data.docs.length > 0){
        this.topics =response.data.docs[0].topics;
      }
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

    var selV = "";

    if(this.topics && this.topics.length){
      selV = this.topics[0];
    }

    this.profileForm.patchValue({
      _id: "",
      topic: selV,
      question: "",
      option_1_text: "",
      option_1_value: false,
      option_2_text: "",
      option_2_value: false,
      option_3_text: "",
      option_3_value: false,
      option_4_text: "",
      option_4_value: false,
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
      topic: row.topic,
      question: row.question,
      option_1_text: row.option_1_text,
      option_1_value: row.option_1_value,
      option_2_text: row.option_2_text,
      option_2_value: row.option_2_value,
      option_3_text: row.option_3_text,
      option_3_value: row.option_3_value,
      option_4_text: row.option_4_text,
      option_4_value: row.option_4_value,
    });

  }

  chkAnswer(event){

    this.profileForm.patchValue({
      option_1_value: false,
      option_2_value: false,
      option_3_value: false,
      option_4_value: false, 
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

      for(var i=0;i<lines.length;i++){
        var line = lines[i];
        var data = line.split(",");
        var row = [];
        for(var j=0;j<data.length;j++){         
          if(i == 0){
            let hd = data[j].replace(/\s/g, "");
            var res = hd.toLowerCase();
            this.headerData.push(res)
          }else{
            row.push(data[j]);
          }          
        }   
        if(i != 0){ 
          this.rowData.push(row);
        }
      }

      let rrrr = [];
      for(var k=0; k < this.rowData.length;k++){
        let rrr = {push:function push(element){ [].push.call(this,element)}};
        for(var l=0; l < this.headerData.length;l++){
            var hData =  this.headerData[l];
            var rData = this.rowData[k][l];
           // console.log("\n hData >>>>>>> ",hData);
           // console.log("\n rData >>>>>>> ",rData);
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
        console.log(rrrr);
        this.csvData = rrrr;
        this.source1.load(rrrr);
        this.importForm.patchValue({
          csvData: "1"     
        });
      }
      
      
    }
  }

  onImportConfirm(event): void {

    this.apiService.importQuestions(this.csvData).subscribe((response) => {

      this.resetListing();
      this.apiService.getTriviaQuestions().subscribe((response) => {
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
    this.apiService.saveQuestion(params).subscribe((response) => {
      this.resetListing();
      this.apiService.getTriviaQuestions().subscribe((response) => {
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
    this.apiService.editQuestion(params).subscribe((response) => {
      this.resetListing();
      this.apiService.getTriviaQuestions().subscribe((response) => {
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
      this.apiService.deleteQuestion(row._id).subscribe((response) => {
        this.apiService.getTriviaQuestions().subscribe((response) => {
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