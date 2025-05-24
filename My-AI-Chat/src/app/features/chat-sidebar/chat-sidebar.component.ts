import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-sidebar',
  imports: [MatSidenavModule, MatListModule, CommonModule,
    FormsModule,],
  templateUrl: './chat-sidebar.component.html',
  styleUrl: './chat-sidebar.component.css',

})
export class ChatSidebarComponent {
  sessions = [
    { id: 1, name: 'New Chat' },
    { id: 2, name: 'Tech Talk' },
    { id: 3, name: 'Finance Help' },
  ];

  selectSession(session: any) {
    console.log('Selected Session:', session);
  }
}
