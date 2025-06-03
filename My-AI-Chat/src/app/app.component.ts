import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatComponent } from "./features/chat/chat.component";
import { ChatSidebarComponent } from "./features/chat-sidebar/chat-sidebar.component";
import { ToolbarComponent } from "./features/toolbar/toolbar.component";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [ChatComponent, ChatSidebarComponent, ToolbarComponent, MatSidenavModule, MatToolbarModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'My-AI-Chat';
}
