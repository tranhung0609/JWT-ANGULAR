import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable} from "rxjs";
import {UserToken} from "../models/user-token";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<UserToken>;
  public currentUser: Observable<UserToken>;

  constructor(private http: HttpClient) {
    // @ts-ignore
    this.currentUserSubject = new BehaviorSubject<UserToken>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserToken {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(API_URL + '/login', {username, password})
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    // @ts-ignore
    this.currentUserSubject.next(null);
  }
}
