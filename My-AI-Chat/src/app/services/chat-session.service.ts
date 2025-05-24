import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ChatSession {
  id: string;
  name: string;
  messages: string[]; // Adjust structure as per your message model
}

@Injectable({
  providedIn: 'root',
})
export class ChatSessionService {
  private sessionsSubject = new BehaviorSubject<ChatSession[]>([]);
  sessions$ = this.sessionsSubject.asObservable();

  private activeSessionId = new BehaviorSubject<string | null>(null);
  activeSessionId$ = this.activeSessionId.asObservable();

  constructor() {
    const defaultSession = this.createNewSession('New Chat');
    this.sessionsSubject.next([defaultSession]);
    this.activeSessionId.next(defaultSession.id);
  }

  createNewSession(name: string): ChatSession {
    const session: ChatSession = {
      id: Date.now().toString(),
      name,
      messages: [],
    };
    this.sessionsSubject.next([...this.sessionsSubject.value, session]);
    this.activeSessionId.next(session.id);
    return session;
  }

  switchSession(id: string) {
    this.activeSessionId.next(id);
  }

  getCurrentSession(): ChatSession | undefined {
    return this.sessionsSubject.value.find(s => s.id === this.activeSessionId.value || '');
  }

  updateMessages(id: string, messages: string[]) {
    const updated = this.sessionsSubject.value.map(session =>
      session.id === id ? { ...session, messages } : session
    );
    this.sessionsSubject.next(updated);
  }
}
