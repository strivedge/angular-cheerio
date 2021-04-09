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
  selector: 'ngx-games',
  styleUrls: ['./games.component.scss'],
  templateUrl: './games.component.html',
})

export class GamesComponent implements OnDestroy {

  profileForm = new FormGroup({
    _id: new FormControl(''),
    name: new FormControl('', Validators.required),
    credits: new FormControl('', Validators.required),
    questions: new FormControl('', Validators.required),
    timer: new FormControl('', Validators.required),
    topics: new FormControl([]),
    picture: new FormControl(''),
  });

  showListing = false;
  showAddForm = false;
  showEditForm = false;
  showTopicForm = false;
  games: any;
  game_icon: any;
  topics = [];
  questions = [];
  topic = "";
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
        filter: false
      } ,
      credits: {
        title: 'Credits',
        type: 'string',
        filter: false
      } ,
      questions: {
        title: 'Questions',
        type: 'string',
        filter: false
      },
      timer: {
        title: 'Timer',
        type: 'string',
        filter: false
      }        
    },
    actions:{
      position: 'right',
      delete: false,
      add: false
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
    this.apiService.getGames().subscribe((response) => {
      this.games = response.data.docs;
      this.source.load(this.games);
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
    
  createGame(): void {
    this.showListing = false;
    this.showAddForm = true;
    this.showEditForm = false;
    this.showTopicForm = true;
    this.topic = "";
    this.topics = [];
    this.profileForm.patchValue({
      _id: "",
      name: "",
      credits: 0,
      questions: "",
      topics: "",
      timer: 0,
      picture: ""
    });
  }

  addTopic(): void{
    
    if(this.topic != ""){
      if(this.topics && this.topics.length > 0){
        var index = this.topics.indexOf(this.topic);
        if(index == -1){
            this.topics.push(this.topic);
        }  
        this.topic = "";
        this.profileForm.patchValue({
          topics: this.topics,
        });
      }else{
        this.topics.push(this.topic);
        this.topic = "";
        this.profileForm.patchValue({
          topics: this.topics,
        });
      }
      
    }

  }

  removeTopic(topic): void{

    if(topic != ""){      
      var index = this.topics.indexOf(topic);
      if(index > -1){
        this.topics.splice( index, 1 );
      } 
      this.profileForm.patchValue({
        topics: this.topics,
      });
    }
  }

  editGame(event): void {

    var row = event.data;
    this.showListing = false;
    this.showAddForm = false;
    this.showEditForm = true;
    this.showTopicForm = true;

    console.log("row",row)
    if(row.topics[0] == 'would_you_rather' || row.topics[0] == 'never_have_ever' || row.topics[0] == 'heads_up'){
      this.showTopicForm = false;
    }

    this.game_icon = this.imagPath +  row.picture;
    this.topic = "";

    if(row.topics && row.topics.length){
      this.topics = row.topics;
    }else{
      this.topics = [];
    }
    

    this.profileForm.patchValue({
      _id: row._id,
      name: row.name,
      credits: row.credits,
      questions: row.questions,
      topics: row.topics,
      timer: row.timer,
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
    this.apiService.saveGame(params).subscribe((response) => {
      this.resetListing();
      this.apiService.getGames().subscribe((response) => {
        this.games = response.data.docs;
        this.source.load(this.games);
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
    this.apiService.editGame(params).subscribe((response) => {
      this.resetListing();
      this.apiService.getGames().subscribe((response) => {
        this.games = response.data.docs;
        this.source.load(this.games);
      }),
      (err: any) => console.log(err),
      () => {}
      ;
    }),
    (err: any) => console.log(err),
    () => {}
    ;
  }

  checkfirstZero(event) {
    const eventName = event.target.name
    const eventValue = event.target.value;
    this.profileForm.patchValue({
      [eventName]: eventValue.replace(/[a-zA-Z]/g, ""),
    });
}

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      var row = event.data;
      this.apiService.deleteGame(row._id).subscribe((response) => {
        this.apiService.getGames().subscribe((response) => {
          this.games = response.data.docs;
          this.source.load(this.games);
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
