import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OllamaService {
  private isInsideThink = false;

  constructor() { }

  private stripThinkTags(content: string): string {
    let output = '';
    let i = 0;

    while (i < content.length) {
      if (!this.isInsideThink && content.slice(i, i + 7) === '<think>') {
        this.isInsideThink = true;
        i += 7;
      } else if (this.isInsideThink && content.slice(i, i + 8) === '</think>') {
        this.isInsideThink = false;
        i += 8;
      } else if (!this.isInsideThink) {
        output += content[i];
        i++;
      } else {
        i++;
      }
    }

    return output;
  }

  async streamChatResponse(
    model: string,
    chatHistory: { role: string; content: string }[],
    onChunk: (visibleToken: string) => void
  ): Promise<void> {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: chatHistory,
        stream: true
      })
    });

    if (!response.ok || !response.body) {
      throw new Error('Failed to connect to Ollama API');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const chunks = buffer.split('\n').filter(line => line.trim());
      for (const chunk of chunks) {
        try {
          const json = JSON.parse(chunk);
          const rawContent = json.message?.content || '';
          const cleanContent = this.stripThinkTags(rawContent);
          onChunk(cleanContent);
        } catch {
          // Ignore JSON parse errors for now
        }
      }

      buffer = '';
    }
  }
}
