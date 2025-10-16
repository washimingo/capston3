import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HuggingFaceService {
  private apiUrl = 'https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct';
  private apiKey = '';

  constructor() {}

  async preguntar(texto: string): Promise<string> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Puedes obtener una API key gratuita en huggingface.co/settings/tokens
        ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {})
      },
      body: JSON.stringify({ inputs: texto })
    });
    if (!response.ok) return 'No se pudo obtener respuesta de la IA.';
    const data = await response.json();
    // Falcon responde con { generated_text: '...' }
    if (data && data.generated_text) {
      return data.generated_text;
    }
    return 'La IA no pudo responder.';
  }
}
