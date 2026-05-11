import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  username = '';
  password = '';
  message = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  loginUser() {

    const data = {
      username: this.username,
      password: this.password
    };

    this.http.post(
      'http://localhost:8080/users/login',
      data,
      { responseType: 'text' }
    ).subscribe({

      next: (token) => {

        localStorage.setItem('token', token);

        this.message = 'Login successful';

        this.router.navigate(['/dashboard']);
      },

      error: () => {
        this.message = 'Login failed';
      }

    });
  }
}