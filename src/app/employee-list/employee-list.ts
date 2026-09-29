import { Component, Input } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-list',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './employee-list.html',

  styleUrl: './employee-list.css'
})

export class EmployeeList {

  employees: any[] = [];

  @Input() searchText = '';

  selectedEmployee: any = {};

  showUpdateForm = false;

  role = '';

  constructor(

    private http: HttpClient,

    private toastr: ToastrService

  ) {}

  ngOnInit() {

    this.role =
      localStorage.getItem('role') || 'USER';

    this.getEmployees();

  }

  isAdmin(): boolean {

    return this.role === 'ADMIN';

  }

  getEmployees() {

    const token = localStorage.getItem('token');

    this.http.get<any[]>(
      'http://localhost:8080/employees/all',

      {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }

    ).subscribe({

      next: (data) => {

        this.employees = data;

      },

      error: () => {

        this.toastr.error(
          'Failed to load employees'
        );

      }

    });

  }

  editEmployee(emp: any) {

    if (!this.isAdmin()) {
      return;
    }

    this.selectedEmployee = { ...emp };

    this.showUpdateForm = true;

  }

  updateEmployee() {

    if (!this.isAdmin()) {
      return;
    }

    const token = localStorage.getItem('token');

    const updatedEmployee = {

      name: this.selectedEmployee.name,

      email: this.selectedEmployee.email,

      phone: this.selectedEmployee.phone,

      department: this.selectedEmployee.department,

      salary: this.selectedEmployee.salary

    };

    this.http.put(
      'http://localhost:8080/employees/update/' +
      this.selectedEmployee.id,

      updatedEmployee,

      {
        headers: {
          Authorization: 'Bearer ' + token
        },

        responseType: 'text'
      }

    ).subscribe({

      next: (response) => {

        this.toastr.success(response);

        this.showUpdateForm = false;

        this.getEmployees();

      },

      error: () => {

        this.toastr.error(
          'Failed to update employee'
        );

      }

    });

  }

  cancelUpdate() {

    this.showUpdateForm = false;

  }

  deleteEmployee(id: number) {

    if (!this.isAdmin()) {
      return;
    }

    const token = localStorage.getItem('token');

    this.http.delete(
      'http://localhost:8080/employees/delete/' + id,

      {
        headers: {
          Authorization: 'Bearer ' + token
        },

        responseType: 'text'
      }

    ).subscribe({

      next: (response) => {

        this.toastr.success(response);

        this.getEmployees();

      },

      error: () => {

        this.toastr.error(
          'Failed to delete employee'
        );

      }

    });

  }

}