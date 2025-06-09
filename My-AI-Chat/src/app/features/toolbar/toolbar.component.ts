import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { OllamaService } from '../../services/ollama.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogModule,
    FormsModule
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {
  @Input() selectedModel: string = '';
  @Input() availableModels: any[] = [];
  messages: { sender: 'user' | 'ai', text: string }[] = [];

  @Output() selectedModelChange = new EventEmitter<string>();
  @Output() clearChatClick = new EventEmitter<void>();


  constructor(
    private chatService: ChatService,
    private ollamaService: OllamaService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.messages = this.chatService.getMessages();
    this.SubScribeToModels();
    //    this.selectedModel = this.availableModels[0]?.id || '';
    // Uncomment the line below if you want to set the selected model from the chat service
    //this.chatService.getSelectedModel();
  }

  SubScribeToModels() {
    this.chatService.getModels().subscribe(models => {
      this.availableModels = models;
      if (models.length > 0 && !this.selectedModel) {
        this.selectedModel = models[0]?.id || '';
        this.changeModel();
      }
    });
  }

  changeModel() {
    this.selectedModelChange.emit(this.selectedModel);
  }

  clearChat() {
    this.clearChatClick.emit();
  }
}
