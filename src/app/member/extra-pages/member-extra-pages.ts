import { Component } from '@angular/core';
import { ChatMessage, ChatbotQuickAction, InviteQr, MemberProfile } from '../models/member.models';
import { MemberService } from '../../services/member.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-member-profile',
  templateUrl: './member-profile.component.html',
  standalone: false,
})
export class MemberProfileComponent {
  loading = true;
  error: string | null = null;
  profile: MemberProfile = {
    fullName: 'John Doe',
    memberId: 'M-12847',
    email: 'john.doe@email.com',
    phone: '+216 20 000 000',
    city: 'Tunis',
    plan: 'COMFORT',
    joinedAt: '2024-02-15',
  };

  constructor(
    private readonly memberService: MemberService,
    private readonly auth: AuthService,
  ) {
    const user = this.auth.getCurrentUser();
    if (user) {
      this.profile.fullName = user.username || this.profile.fullName;
      this.profile.email = user.email || this.profile.email;
      if (user.memberId) {
        this.profile.memberId = `M-${user.memberId}`;
      }
    }

    this.memberService.getMe().subscribe({
      next: (member) => {
        this.loading = false;
        this.error = null;
        this.profile = {
          ...this.profile,
          memberId: member?.memberId ? `M-${member.memberId}` : this.profile.memberId,
          email: member?.email || this.profile.email,
          phone: this.profile.phone,
          city: member?.region || this.profile.city,
          joinedAt: member?.createdAt?.slice(0, 10) || this.profile.joinedAt,
        };
      },
      error: (e) => {
        this.loading = false;
        this.error = e?.error?.message ?? e?.message ?? 'Could not load profile from backend.';
      },
    });
  }
}

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  standalone: false,
})
export class MemberMessagesComponent {
  draft = '';
  selectedMember = '';
  members = [
    { id: 'marie', initials: 'M', name: 'Marie Dupont', preview: 'Perfect, thank you so much...', time: '10:35 AM' },
    { id: 'amadou', initials: 'A', name: 'Amadou Diallo', preview: 'No messages yet', time: '' },
    { id: 'fatou', initials: 'F', name: 'Fatou Sow', preview: 'If your trust score is above...', time: 'Yesterday' },
    { id: 'omar', initials: 'O', name: 'Omar Ndiaye', preview: 'No messages yet', time: '' },
    { id: 'aissatou', initials: 'A', name: 'Aissatou Ba', preview: 'No messages yet', time: '' },
  ];
  messages: ChatMessage[] = [
    { id: '1', sender: 'agent', text: 'Hello! Your claim C-002 is currently under review.', time: '09:15' },
    { id: '2', sender: 'member', text: 'Thanks. Do you need any additional document?', time: '09:17' },
    { id: '3', sender: 'agent', text: 'Not for now. We will notify you once finalized.', time: '09:19' },
  ];

  get currentMemberName(): string {
    return this.members.find((m) => m.id === this.selectedMember)?.name ?? 'Conversation';
  }

  send(): void {
    const text = this.draft.trim();
    if (!text) return;
    this.messages.push({
      id: `${Date.now()}`,
      sender: 'member',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    this.draft = '';
  }
}

@Component({
  selector: 'app-invitation-qr',
  templateUrl: './invitation-qr.component.html',
  standalone: false,
})
export class InvitationQrComponent {
  qr: InviteQr = {
    code: 'INV-ALPHA12',
    expiresAt: '2026-05-01',
    invitedCount: 3,
  };
}

@Component({
  selector: 'app-member-chatbot',
  templateUrl: './member-chatbot.component.html',
  standalone: false,
})
export class MemberChatbotComponent {
  prompt = '';
  conversation: ChatMessage[] = [
    { id: '1', sender: 'bot', text: 'Hi! I can help with claims, payments, and member services.', time: '09:00' },
  ];
  quickActions: ChatbotQuickAction[] = [
    { id: 'claim-status', label: 'Claim status', prompt: 'What is the status of my latest claim?' },
    { id: 'payment-date', label: 'Next payment', prompt: 'When is my next payment due?' },
    { id: 'doctor-booking', label: 'Book doctor', prompt: 'How do I book a consultation?' },
  ];

  apply(action: ChatbotQuickAction): void {
    this.prompt = action.prompt;
    this.ask();
  }

  ask(): void {
    const text = this.prompt.trim();
    if (!text) return;
    this.conversation.push({ id: `${Date.now()}-user`, sender: 'member', text, time: '' });
    this.conversation.push({
      id: `${Date.now()}-bot`,
      sender: 'bot',
      text: 'I understood your request. A full integration can connect this assistant to your backend knowledge base.',
      time: '',
    });
    this.prompt = '';
  }
}
