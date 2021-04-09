import { of as observableOf,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService{  

  constructor(private http: HttpClient){}

  getPlans(): Observable<any> {    
    return this.http.get("/api/plans/");
  }

  savePlan(parms): Observable<any> {    
    return this.http.post("/api/plans/",parms);
  }

  editPlan(parms): Observable<any> {    
    return this.http.put("/api/plans/",parms);
  }

  deletePlan(id): Observable<any> {    
    return this.http.delete("/api/plans/"+id);
  }

  getCategories(): Observable<any> {    
    return this.http.get("/api/categories/");
  }

  saveCategory(parms): Observable<any> {    
    return this.http.post("/api/categories/",parms);
  }

  editCategory(parms): Observable<any> {    
    return this.http.put("/api/categories/",parms);
  }

  deleteCategory(id): Observable<any> {    
    return this.http.delete("/api/categories/"+id);
  }

  getGame(id): Observable<any> {    
    return this.http.get("/api/games/"+id);
  }

  getGames(params=""): Observable<any> {    
    return this.http.get("/api/games/?"+params);
  }

  saveGame(parms): Observable<any> {    
    return this.http.post("/api/games/",parms);
  }

  editGame(parms): Observable<any> {    
    return this.http.put("/api/games/",parms);
  }

  deleteGame(id): Observable<any> {    
    return this.http.delete("/api/games/"+id);
  }

  getUsers(): Observable<any> {    
    return this.http.get("/api/users/");
  }

  getUsersList(): Observable<any> {    
    return this.http.get("/api/users/list");
  }

  saveUser(parms): Observable<any> {    
    return this.http.post("/api/users",parms);
  }

  editUser(parms): Observable<any> {    
    return this.http.put("/api/users/",parms);
  }

  deleteUser(id): Observable<any> {    
    return this.http.delete("/api/users/"+id);
  }

  getPayments(): Observable<any> {    
    return this.http.get("/api/payments/");
  }

  savePayment(parms): Observable<any> {    
    return this.http.post("/api/payments",parms);
  }

  editPayment(parms): Observable<any> {    
    return this.http.put("/api/payments/",parms);
  }

  deletePayment(id): Observable<any> {    
    return this.http.delete("/api/payments/"+id);
  }

  getPersonalities(): Observable<any> {    
    return this.http.get("/api/personalities/");
  }

  savePersonality(parms): Observable<any> {    
    return this.http.post("/api/personalities/",parms);
  }

  editPersonality(parms): Observable<any> {    
    return this.http.put("/api/personalities/",parms);
  }

  deletePersonality(id): Observable<any> {    
    return this.http.delete("/api/personalities/"+id);
  }

  getQuestions(): Observable<any> {    
    return this.http.get("/api/questions/");
  }
  getTriviaQuestions(): Observable<any> {    
    return this.http.get("/api/questions/trivia");
  }

  getTopicQuestion(parms): Observable<any> {    
    return this.http.post("/api/questions/topic",parms);
  }

  importQuestions(parms): Observable<any> {    
    return this.http.post("/api/questions/import",parms);
  }

  saveQuestion(parms): Observable<any> {    
    return this.http.post("/api/questions/",parms);
  }

  editQuestion(parms): Observable<any> {    
    return this.http.put("/api/questions/",parms);
  }

  deleteQuestion(id): Observable<any> {    
    return this.http.delete("/api/questions/"+id);
  }

  getRedeems(): Observable<any> {    
    return this.http.get("/api/redeems/");
  }

  saveRedeem(parms): Observable<any> {    
    return this.http.post("/api/redeems/",parms);
  }

  editRedeem(parms): Observable<any> {    
    return this.http.put("/api/redeems/",parms);
  }

  deleteRedeem(id): Observable<any> {    
    return this.http.delete("/api/redeems/"+id);
  }

  getVouchers(): Observable<any> {    
    return this.http.get("/api/vouchers/");
  }

  getVoucher(id): Observable<any> {    
    return this.http.get("/api/vouchers/"+id);
  }

  getUserRedeems(): Observable<any> {    
    return this.http.get("/api/vouchers/user-voucher");
  }

  saveVoucher(parms): Observable<any> {    
    return this.http.post("/api/vouchers/",parms);
  }

  editVoucher(parms): Observable<any> {    
    return this.http.put("/api/vouchers/",parms);
  }

  deleteVoucher(id): Observable<any> {    
    return this.http.delete("/api/vouchers/"+id);
  }

  addremVoucherCode(parms): Observable<any> {    
    return this.http.put("/api/vouchers/code",parms);
  }

  createGiftCard(parms): Observable<any> {    
    return this.http.post("/api/amazon/createGiftCard",parms);
  }

  deactiveGiftCard(parms): Observable<any> {    
    return this.http.post("/api/amazon/deactiveGiftCard",parms);
  }

  cancelGiftCard(parms): Observable<any> {    
    return this.http.post("/api/amazon/cancelGiftCard",parms);
  }


  getSettings(): Observable<any> {    
    return this.http.get("/api/settings/");
  }

  saveSetting(parms): Observable<any> {    
    return this.http.post("/api/settings/",parms);
  }

  editSetting(parms): Observable<any> {    
    return this.http.put("/api/settings/",parms);
  }

  deleteSetting(id): Observable<any> {    
    return this.http.delete("/api/settings/"+id);
  }

  getNotificationLog(): Observable<any> {    
    return this.http.get("/api/notifications/log/");
  }

}