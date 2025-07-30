import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransacaoService {
  private baseUrl = 'http://localhost:8080/transacoes';

  constructor(private http: HttpClient) {}

  filtrarTransacoes(filtro: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/filtrar`, filtro);
  }
}
