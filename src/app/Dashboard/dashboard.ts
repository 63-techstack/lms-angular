import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AddEmployee } from '../add-employee/add-employee';
import { EmployeeList } from '../employee-list/employee-list';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AddEmployee, EmployeeList],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  constructor(private router: Router) {}

  logout() {

    localStorage.removeItem('token');

    this.router.navigate(['/']);
  }
}