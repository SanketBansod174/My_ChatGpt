import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from "../../shared/confirm-dialog/confirm-dialog.component";
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule, ConfirmDialogComponent],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('chatContainer') private messagesContainer!: ElementRef;
  messages: { sender: 'user' | 'ai', text: string }[] = [];

  newMessage = '';
  private previousMessageCount = 0;
  menuOpen = false;
  showConfirmDialog = false;
  chatservice: any;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  constructor(private chatService: ChatService) {
    this.chatService = chatService;
  }

  ngOnInit() {
    this.messages = this.chatService.getMessages();
  }

  ngAfterViewChecked(): void {
    if (this.messages.length !== this.previousMessageCount) {
      this.scrollToBottom();
      this.previousMessageCount = this.messages.length;
    }
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const userInput = this.newMessage;
    this.newMessage = '';
    this.chatService.addUserMessage(userInput);

    setTimeout(() => {
      this.chatService.addAiMessage(`You said: "${userInput}". This is a mock response.`);
      this.messages = this.chatService.getMessages(); // Refresh
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

  saveMessages() {
    localStorage.setItem('chat_history', JSON.stringify(this.messages));
  }

  clearChat() {
    this.showConfirmDialog = true;
  }

  handleConfirmation(confirmed: boolean) {
    this.showConfirmDialog = false;
    if (confirmed) {
      this.chatService.clearMessages();
      this.messages = this.chatService.getMessages();
    }
  }


  availableModels = this.chatService.getModels();
  selectedModel = this.chatService.getSelectedModel();

  changeModel() {
    this.chatService.setModel(this.selectedModel);
  }

}