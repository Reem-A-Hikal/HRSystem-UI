import { ChatbotService } from './../../services/chatbot.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent {
  isChatOpen: boolean = false;
  userMessage: string = '';
  isLoading: boolean = false;

  messages: { sender: string; text: string }[] = [];
  @ViewChild('scrollMe') scrollContainer!: ElementRef;

  constructor(private Chat: ChatbotService) {}

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollToBottom();
      }
    }, 0);
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error', err);
    }
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;
    const messageText = this.userMessage.trim();

    this.messages.push({ sender: 'You', text: messageText });
    this.userMessage = '';
    this.isLoading = true;
    this.scrollToBottom();

    this.Chat.sendMessage(messageText).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (!response || !response.reply) {
          // console.error('Invalid response from server:', response);
          this.messages.push({
            sender: 'Bot',
            text: 'Sorry, I did not understand that.',
          });
          this.scrollToBottom();
          return;
        }
        // console.log('Response from server:', response);
        this.messages.push({ sender: 'Bot', text: response.reply });
        this.userMessage = '';
        this.scrollToBottom();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error sending message:', error);
        this.messages.push({
          sender: 'Bot',
          text: 'Sorry, something went wrong.',
        });
        this.scrollToBottom();
      },
    });
  }
}
