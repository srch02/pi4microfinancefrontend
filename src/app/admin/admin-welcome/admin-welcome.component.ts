import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-welcome',
  templateUrl: './admin-welcome.component.html',
  standalone: false
})
export class AdminWelcomeComponent {
  showMemberPortal = false;
  showUserModal = false;
  showAdminLogin = false;
  username = '';
  password = '';
  loginError = '';
  isLoggingIn = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  openMemberPortal() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/app']);
    } else {
      this.showMemberPortal = true;
    }
  }

  openAdminLogin() {
    this.showAdminLogin = true;
  }

  closeAdminLogin() {
    this.showAdminLogin = false;
    this.loginError = '';
    this.username = '';
    this.password = '';
  }

  handleAdminLogin(event: Event) {
    event.preventDefault();
    this.loginError = '';
    this.isLoggingIn = true;

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        const role = response.role?.toUpperCase();
        if (role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.loginError = 'Access denied. Admin account required.';
          this.authService.logout();
          this.isLoggingIn = false;
        }
      },
      error: (err: any) => {
        this.loginError = err?.error?.message || 'Invalid credentials. Please try again.';
        this.isLoggingIn = false;
      }
    });
  }

  navigateToAdminDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }
}
