import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private modelsSubject = new BehaviorSubject<any[]>([]);

  private http = inject(HttpClient);

  models: { id: string, name: string }[] = [];
  private readonly MODEL_KEY = 'selected_model';
  //selectedModelId: string = this.models[0].id;

  private readonly STORAGE_KEY = 'chat_history';
  messages: { sender: 'user' | 'ai', text: string }[] = [
    { sender: 'ai', text: 'Hello! How can I help you today?' }
  ];


  constructor() {
    // this.loadModel();
    this.loadMessages();
    this.fetchLocalOllamaModels();
  }

  fetchLocalOllamaModels() {
    this.http.get('http://localhost:11434/api/tags').subscribe({
      next: (response: any) => {
        if (response?.models) {
          this.models = response.models.map((item: any) => ({
            id: item.model,
            name: item.name
          }));

          this.modelsSubject.next(this.models);

          /*
          console.log('Available models:', this.models);
          const storedModel = localStorage.getItem(this.MODEL_KEY);
          if (storedModel && this.models.some(m => m.id === storedModel)) {
            this.selectedModelId = storedModel;
          }
            */
        }
      },
      error: (error) => {
        console.error('Error fetching models:', error);
      }
    });
  }


  getMessages() {
    return this.messages;
  }

  addUserMessage(text: string) {
    this.messages.push({ sender: 'user', text });
    this.saveMessages();
  }

  addAiMessage(text: string) {
    this.messages.push({ sender: 'ai', text });
    this.saveMessages();
  }

  clearMessages() {
    this.messages = [
      { sender: 'ai', text: 'Chat cleared. How can I help you now?' }
    ];
    this.saveMessages();
  }

  private saveMessages() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.messages));
  }

  private loadMessages() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.messages = JSON.parse(saved);
    }
  }

  getModels() {
    return this.modelsSubject.asObservable();
  }


  setModel(modelId: string) {
    /*
    this.selectedModelId = modelId;
    localStorage.setItem(this.MODEL_KEY, modelId);
    */
  }


  getSelectedModel() {
    // return this.selectedModelId;
    return '';
  }

  /*
    private loadModel() {
      const stored = localStorage.getItem(this.MODEL_KEY);
      if (stored && this.models.some(m => m.id === stored)) {
        this.selectedModelId = stored;
      }
    }
  */
  updateLastAiMessage(content: string) {
    const msgs = this.getMessages();
    const lastIndex = msgs.length - 1;
    if (lastIndex >= 0 && msgs[lastIndex].sender === 'ai') {
      msgs[lastIndex].text = content;
      this.saveMessages();
    }
  }
}
