import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('chatContainer') private messagesContainer!: ElementRef;

  messages = [
    { sender: 'ai', text: 'Hello! How can I help you today?' },
  ];
  newMessage = '';
  private previousMessageCount = 0;

  ngAfterViewChecked(): void {
    if (this.messages.length !== this.previousMessageCount) {
      this.scrollToBottom();
      this.previousMessageCount = this.messages.length;
    }
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    this.messages.push({ sender: 'user', text: this.newMessage });

    const userInput = this.newMessage;
    this.newMessage = '';

    // Simulate AI thinking
    setTimeout(() => {
      this.messages.push({
        sender: 'ai',
        text: `You said: "${userInput}". This is a mock response.`,
      });
    }, 1000);
  }

  private scrollToBottom() {
    if (!this.messagesContainer) {
      console.warn('messagesContainer is not yet initialized.');
      return;
    }
    try {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
      } catch (err) {
      console.error('Failed to scroll to bottom:', err);
    }
  }
}