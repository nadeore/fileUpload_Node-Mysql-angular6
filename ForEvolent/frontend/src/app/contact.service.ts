import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

const apiUrl = 'http://localhost:3000';
@Injectable()

export class ContactService {
  constructor(private http: HttpClient) { }

  createUser(user: Object): Observable<Object> {
      return this.http.post(`${apiUrl}/create`, user);
  }

  getUserList(): Observable<any> {
      return this.http.get(`${apiUrl}/getList`);
  }

  getUser(id: number): Observable<any> {
      return this.http.get(`${apiUrl}/getUser/${id}`);
  }

  updateUser(user: Object): Observable<Object> {
      return this.http.put(`${apiUrl}/updateUser/`, user);
  }

  deleteUser(userDel: { Status: string; id: number }) {
    return this.http.post(`${apiUrl}/delete/`, userDel);
  }


  upload_file(fileToUpload: object): Observable<object> {
    return this.http.post(`${apiUrl}/upload/`, fileToUpload);
  }
}
