import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class EmployeeList {

  employees: any[] = [];
  searchText = '';

  selectedEmployee: any = {};
  showUpdateForm = false;

  constructor(private http: HttpClient) {}

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
        alert('Failed to load employees');
      }
    });
  }

  editEmployee(emp: any) {
    this.selectedEmployee = { ...emp };
    this.showUpdateForm = true;
  }

  updateEmployee() {

    const token = localStorage.getItem('token');

    const updatedEmployee = {
      name: this.selectedEmployee.name,
      email: this.selectedEmployee.email,
      phone: this.selectedEmployee.phone,
      department: this.selectedEmployee.department,
      salary: this.selectedEmployee.salary
    };

    this.http.put(
      'http://localhost:8080/employees/update/' + this.selectedEmployee.id,
      updatedEmployee,
      {
        headers: {
          Authorization: 'Bearer ' + token
        },
        responseType: 'text'
      }
    ).subscribe({
      next: (response) => {
        alert(response);
        this.showUpdateForm = false;
        this.getEmployees();
      },
      error: () => {
        alert('Failed to update employee');
      }
    });
  }

  cancelUpdate() {
    this.showUpdateForm = false;
  }

  deleteEmployee(id: number) {

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
        alert(response);
        this.getEmployees();
      },
      error: () => {
        alert('Failed to delete employee');
      }
    });
  }
}