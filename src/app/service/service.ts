// src/app/service/auth.service.ts (com método isLoggedIn e logout)
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  register(username: string, password: string, accessKey: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password, accessKey });
  }

  // Verifica se o token está salvo no localStorage
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Salvar token após login
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
