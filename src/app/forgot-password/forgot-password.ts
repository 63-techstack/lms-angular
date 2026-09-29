import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {

  email = '';
  otp = '';
  newPassword = '';
  confirmPassword = '';

  message = '';

  otpSent = false;
  otpVerified = false;

  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  sendOtp() {

    if (!this.email.trim()) {
      this.message = 'Email is required';
      return;
    }

    const data = {
      email: this.email.trim()
    };

    this.http.post(
      'http://localhost:8080/users/send-otp',
      data,
      { responseType: 'text' }
    ).subscribe({

      next: (response) => {
        this.message = response;

        if (response === 'OTP Sent Successfully') {
          this.otpSent = true;
        }
      },

      error: () => {
        this.message = 'Failed to send OTP';
      }

    });

  }

  verifyOtp() {

    if (!this.otp.trim()) {
      this.message = 'OTP is required';
      return;
    }

    const data = {
      email: this.email.trim(),
      otp: this.otp.trim()
    };

    this.http.post(
      'http://localhost:8080/users/verify-otp',
      data,
      { responseType: 'text' }
    ).subscribe({

      next: (response) => {
        this.message = response;

        if (response === 'OTP Verified Successfully') {
          this.otpVerified = true;
        }
      },

      error: () => {
        this.message = 'OTP verification failed';
      }

    });

  }

  resetPassword() {

    if (
      !this.newPassword.trim() ||
      !this.confirmPassword.trim()
    ) {
      this.message = 'Password fields are required';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.message = 'Passwords do not match';
      return;
    }

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordPattern.test(this.newPassword)) {
      this.message =
        'Password must have uppercase, lowercase, number, special character and minimum 8 characters';
      return;
    }

    const data = {
      email: this.email.trim(),
      otp: this.otp.trim(),
      newPassword: this.newPassword.trim()
    };

    this.http.post(
      'http://localhost:8080/users/reset-password',
      data,
      { responseType: 'text' }
    ).subscribe({

      next: (response) => {
        this.message = response;

        if (response === 'Password Reset Successfully') {
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500);
        }
      },

      error: () => {
        this.message = 'Password reset failed';
      }

    });

  }

}