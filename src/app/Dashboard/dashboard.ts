import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { BaseChartDirective } from 'ng2-charts';

import {
  Chart,
  registerables,
  ChartConfiguration,
  ChartData,
  ChartType
} from 'chart.js';

import { Sidebar } from '../sidebar/sidebar';
import { AddEmployee } from '../add-employee/add-employee';
import { EmployeeList } from '../employee-list/employee-list';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    Sidebar,
    AddEmployee,
    EmployeeList,
    BaseChartDirective,
    FormsModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  searchText = '';

  role = '';

  totalEmployees = 0;
  totalCourses = 4;
  completedTrainings = 0;
  pendingTrainings = 0;

  pieChartType: ChartType = 'pie';

  pieChartData: ChartData<'pie', number[], string> = {
    labels: ['Completed Trainings', 'Pending Trainings'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#22c55e', '#ef4444']
      }
    ]
  };

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  barChartType: ChartType = 'bar';

  barChartData: ChartData<'bar', number[], string> = {
    labels: ['Employees', 'Courses', 'Completed', 'Pending'],
    datasets: [
      {
        label: 'LMS Statistics',
        data: [0, 0, 0, 0],
        backgroundColor: ['#4f46e5', '#10b981', '#f97316', '#ef4444']
      }
    ]
  };

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    }
  };

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {

    this.role = localStorage.getItem('role') || 'USER';

    this.loadDashboardData();

  }

  isAdmin(): boolean {
    return this.role === 'ADMIN';
  }

  loadDashboardData() {

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

        this.totalEmployees = data.length;
        this.completedTrainings = Math.floor(data.length * 0.6);
        this.pendingTrainings = data.length - this.completedTrainings;

        this.pieChartData = {
          labels: ['Completed Trainings', 'Pending Trainings'],
          datasets: [
            {
              data: [
                this.completedTrainings,
                this.pendingTrainings
              ],
              backgroundColor: ['#22c55e', '#ef4444']
            }
          ]
        };

        this.barChartData = {
          labels: ['Employees', 'Courses', 'Completed', 'Pending'],
          datasets: [
            {
              label: 'LMS Statistics',
              data: [
                this.totalEmployees,
                this.totalCourses,
                this.completedTrainings,
                this.pendingTrainings
              ],
              backgroundColor: ['#4f46e5', '#10b981', '#f97316', '#ef4444']
            }
          ]
        };

      },

      error: () => {
        console.log('Failed to load dashboard data');
      }

    });

  }

  logout() {

    localStorage.removeItem('token');
    localStorage.removeItem('role');

    this.router.navigate(['/']);

  }

}