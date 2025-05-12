import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatComponent } from "./features/chat/chat.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ChatComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'My-AI-Chat';
}
