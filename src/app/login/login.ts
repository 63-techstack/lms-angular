import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,

  imports: [
    FormsModule,
    RouterLink
  ],

  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {

  username = 'shaik';
  password = '';

  showPassword = false;

  message = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  loginUser() {

    if (
      !this.username.trim() ||
      !this.password.trim()
    ) {
      this.message = 'Username and password are required';
      return;
    }

    const data = {
      username: this.username.trim(),
      password: this.password.trim()
    };

    this.http.post(
      'http://localhost:8080/users/login',
      data,
      { responseType: 'text' }

    ).subscribe({

      next: (token) => {

        if (
          !token ||
          token === 'User Not Found' ||
          token === 'Invalid Password'
        ) {
          this.message = token || 'Login failed';
          return;
        }

        localStorage.setItem('token', token);

        const role = this.getRoleFromToken(token);

        localStorage.setItem('role', role);

        this.message = 'Login successful';

        this.router.navigate(['/dashboard']);

      },

      error: () => {
        this.message = 'Invalid username or password';
      }

    });

  }

  getRoleFromToken(token: string): string {

    try {

      const payload = token.split('.')[1];

      const decodedPayload = JSON.parse(atob(payload));

      return decodedPayload.role;

    } catch (error) {

      return 'USER';

    }

  }

}