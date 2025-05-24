import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatComponent } from "./features/chat/chat.component";
import { ChatSidebarComponent } from "./features/chat-sidebar/chat-sidebar.component";

@Component({
  selector: 'app-root',
  imports: [ ChatComponent, ChatSidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'My-AI-Chat';
}
