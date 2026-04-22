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

    setTimeout(() => {
      if (this.username === 'admin' && this.password === 'admin123') {
        this.navigateToAdminDashboard();
      } else {
        this.loginError = 'Invalid credentials. Please try again.';
        this.isLoggingIn = false;
      }
    }, 800);
  }

  navigateToAdminDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }
}
