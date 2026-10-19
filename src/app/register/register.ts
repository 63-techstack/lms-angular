import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,

  imports: [
    FormsModule,
    RouterLink
  ],

  templateUrl: './register.html',
  styleUrl: './register.css'
})

export class Register {

  firstName = '';
  middleName = '';
  lastName = '';

  email = '';
  phone = '';

  username = '';

  password = '';
  confirmPassword = '';

  showPassword = false;
  showConfirmPassword = false;

  message = '';
  submitted = false;

  // Loader
  isLoading = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  registerUser() {

    this.submitted = true;

    if (
      !this.firstName.trim() ||
      !this.lastName.trim() ||
      !this.email.trim() ||
      !this.phone.trim() ||
      !this.username.trim() ||
      !this.password.trim() ||
      !this.confirmPassword.trim()
    ) {
      return;
    }

    // Email Validation
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(this.email)) {

      this.message = 'Please enter valid email address';

      return;
    }

    // Phone Validation
    const phonePattern =
      /^[6-9][0-9]{9}$/;

    if (!phonePattern.test(this.phone)) {

      this.message =
        'Please enter valid 10 digit Indian phone number';

      return;
    }

    // Strong Password Validation
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordPattern.test(this.password)) {

      this.message =
        'Password must have uppercase, lowercase, number, special character and minimum 8 characters';

      return;
    }

    // Confirm Password Validation
    if (this.password !== this.confirmPassword) {

      this.message = 'Passwords do not match';

      return;
    }

    const data = {

      firstName: this.firstName,

      middleName: this.middleName,

      lastName: this.lastName,

      email: this.email,

      phone: this.phone,

      username: this.username,

      role: 'USER',

      password: this.password
    };

    // Start Loader
    this.isLoading = true;

    this.http.post(
      'http://localhost:8080/users/register',
      data,
      { responseType: 'text' }

    ).subscribe({

      next: (response) => {

        // Stop Loader
        this.isLoading = false;

        this.message = response;

        setTimeout(() => {

          this.router.navigate(['/']);

        }, 1500);

      },

      error: () => {

        // Stop Loader
        this.isLoading = false;

        this.message = 'Registration failed';

      }

    });

  }

}