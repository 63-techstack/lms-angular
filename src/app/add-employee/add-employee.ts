import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-employee.html',
  styleUrl: './add-employee.css'
})
export class AddEmployee {

  name = '';
  email = '';
  phone = '';
  department = '';
  salary = '';

  courses: any[] = [];
  selectedCourseId = '';

  message = '';

  constructor(private http: HttpClient) {
    this.loadCourses();
  }

  loadCourses() {

    const token = localStorage.getItem('token');

    this.http.get<any[]>(
      'http://localhost:8080/courses/all',
      {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }
    ).subscribe({
      next: (data) => {
        this.courses = data;
      },
      error: () => {
        alert('Failed to load courses');
      }
    });
  }

  saveEmployee() {

    const token = localStorage.getItem('token');

    const employee = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      department: this.department,
      salary: this.salary
    };

    this.http.post<any>(
      'http://localhost:8080/employees/save',
      employee,
      {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }
    ).subscribe({
      next: (savedEmployee) => {

        const employeeId = savedEmployee.id;

        this.http.put(
          'http://localhost:8080/employees/assign-course?employeeId='
          + employeeId + '&courseId=' + this.selectedCourseId,
          {},
          {
            headers: {
              Authorization: 'Bearer ' + token
            },
            responseType: 'text'
          }
        ).subscribe({
          next: () => {
            this.message = 'Employee saved and course assigned successfully';
          },
          error: () => {
            this.message = 'Employee saved but course assignment failed';
          }
        });
      },
      error: () => {
        this.message = 'Failed to save employee';
      }
    });
  }
}