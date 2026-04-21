import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MemberService } from '../../services/member.service';

@Component({
  selector: 'app-member-root',
  templateUrl: './member-root.component.html',
  standalone: false,
})
export class MemberRootComponent {}

@Component({
  selector: 'app-member-app',
  templateUrl: './member-app.component.html',
  standalone: false,
})
export class MemberAppComponent implements OnInit {
  profileMenuOpen = false;
  user = {
    name: 'John Doe',
    email: 'john.doe@email.com',
    memberId: 'M-12847',
    plan: 'COMFORT',
  };

  constructor(
    readonly memberRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly auth: AuthService,
    private readonly memberService: MemberService,
  ) {}

  ngOnInit(): void {
    const sessionUser = this.auth.getCurrentUser();
    if (sessionUser) {
      this.user = {
        name: sessionUser.username || this.user.name,
        email: sessionUser.email || this.user.email,
        memberId: sessionUser.memberId ? `M-${sessionUser.memberId}` : this.user.memberId,
        plan: this.user.plan,
      };
    }

    this.memberService.getMe().subscribe({
      next: (member) => {
        this.user = {
          name: sessionUser?.username || this.user.name,
          email: member?.email || sessionUser?.email || this.user.email,
          memberId: member?.memberId ? `M-${member.memberId}` : this.user.memberId,
          plan: member?.priceConfort != null ? 'COMFORT' : this.user.plan,
        };
      },
      error: () => {
        // Keep the UI usable with session/fallback values when /members/me is unavailable.
      },
    });
  }

  get initials(): string {
    return this.user.name
      .split(' ')
      .map((p) => p.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  toggleProfileMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  @HostListener('document:click')
  closeProfileMenu(): void {
    this.profileMenuOpen = false;
  }

  logout(): void {
    this.auth.logout();
    this.profileMenuOpen = false;
    this.router.navigate(['/sign-in']);
  }
}
