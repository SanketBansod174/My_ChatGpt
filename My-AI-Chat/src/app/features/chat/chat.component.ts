import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from "../../shared/confirm-dialog/confirm-dialog.component";
import { ChatService } from '../../services/chat.service';
import { OllamaService } from '../../services/ollama.service';

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
  availableModels: any[] = [];
  selectedModel: string = '';
  isLoading = false;

  constructor(private chatService: ChatService, private ollamaService: OllamaService) { }

  changeModel() {
    this.chatService.setModel(this.selectedModel);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  ngOnInit() {
    this.messages = this.chatService.getMessages();
    this.availableModels = this.chatService.getModels();
    this.selectedModel = this.chatService.getSelectedModel();
  }

  ngAfterViewChecked(): void {
    if (this.messages.length !== this.previousMessageCount) {
      this.scrollToBottom();
      this.previousMessageCount = this.messages.length;
    }
  }

  async sendMessage() {
    if (!this.newMessage.trim()) return;

    const userInput = this.newMessage.trim();
    this.newMessage = '';
    this.chatService.addUserMessage(userInput);
    this.messages = this.chatService.getMessages();
    this.isLoading = true;

    const history = [
      { role: 'system', content: 'You are a helpful assistant.' },
      ...this.messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      })),
      { role: 'user', content: userInput }
    ];

    this.chatService.addAiMessage('');
    this.messages = this.chatService.getMessages(); // ✅ Render empty AI placeholder

    try {
      await this.ollamaService.streamChatResponse(
        this.chatService.getSelectedModel(),
        history,
        (token: string) => {
          const current = this.chatService.getMessages().at(-1)?.text || '';
          this.chatService.updateLastAiMessage(current + token);
          this.messages = this.chatService.getMessages(); // trigger UI update
        }
      );
    } catch (error) {
      this.chatService.updateLastAiMessage("⚠️ Streaming failed.");
      console.error(error);
    }

    this.isLoading = false;
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

}