import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  models = [
    { id: 'deepseek-coder:14b', name: 'DeepSeek R1 14B' },
    { id: 'deepseek-coder:8b', name: 'DeepSeek R1 8B' },
    { id: 'deepcoder:latest', name: 'DeepCoder' },
    { id: 'codellama:7b', name: 'CodeLlama 7B' }
  ];
  private readonly apiUrl = '/api/api/generate'; // First /api is the proxy path
  private readonly MODEL_KEY = 'selected_model';
  selectedModelId: string = this.models[0].id;

  private readonly STORAGE_KEY = 'chat_history';
  messages: { sender: 'user' | 'ai', text: string }[] = [
    { sender: 'ai', text: 'Hello! How can I help you today?' }
  ];


  constructor() {
    this.loadModel();
    this.loadMessages();
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
    return this.models;
  }

  setModel(modelId: string) {
    this.selectedModelId = modelId;
    localStorage.setItem(this.MODEL_KEY, modelId);
  }

  getSelectedModel() {
    return this.selectedModelId;
  }

  private loadModel() {
    const stored = localStorage.getItem(this.MODEL_KEY);
    if (stored && this.models.some(m => m.id === stored)) {
      this.selectedModelId = stored;
    }
  }

  updateLastAiMessage(content: string) {
    const msgs = this.getMessages();
    const lastIndex = msgs.length - 1;
    if (lastIndex >= 0 && msgs[lastIndex].sender === 'ai') {
      msgs[lastIndex].text = content;
      this.saveMessages();
    }
  }
}
