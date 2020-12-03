import { of as observableOf,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Contacts, RecentUsers, UserData } from '../data/users';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService extends UserData {

  private time: Date = new Date; 
  user: any;
  user_id: any;

  private users = {};
  private types = {
    mobile: 'mobile',
    home: 'home',
    work: 'work',
  };
  private contacts: Contacts[] = [];
  private recentUsers: RecentUsers[]  = [];

  constructor(private authService: NbAuthService, private http: HttpClient){
    super();
      this.authService.onTokenChange()
        .subscribe((token: NbAuthJWTToken) => {
          if (token.isValid()) {
            var tokenData = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable 
            this.user_id = tokenData.id;
          }
        });
  }

  getUser(): Observable<any> {    
    return this.http.get("/api/admins/"+this.user_id);
  }

  getUsers(): Observable<any> {    
    return observableOf(this.user);
  }

  getContacts(): Observable<Contacts[]> {
    return observableOf(this.contacts);
  }

  getRecentUsers(): Observable<RecentUsers[]> {
    return observableOf(this.recentUsers);
  }
}
