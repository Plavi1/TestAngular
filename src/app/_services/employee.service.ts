import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Employee } from '../_models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  readonly baseUrl = environment.apiEndpointUrl;

  constructor(private http: HttpClient){}

  getEmployees(){
    return this.http.get<Employee[]>(this.baseUrl);
  }
}
