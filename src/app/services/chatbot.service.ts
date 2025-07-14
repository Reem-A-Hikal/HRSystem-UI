import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = `${environment.apiBaseUrl}/chatbot`;

constructor(private http: HttpClient) { }

  sendMessage(message: string) {
    return this.http.post<any>( this.apiUrl , { message });
  }

}
