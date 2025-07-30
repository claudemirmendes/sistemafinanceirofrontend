import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Transacao {
  tipo: string;
  valor: number;
  descricao: string;
  dataPrevistaRecebimento: string | null;
  dataRecebida: string | null;
  confirmada: boolean | null;
  dataVencimento: string | null;
  dataPagamento: string | null;
  paga: boolean | null;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule]
})
export class DashboardComponent implements OnInit {
  transacoes: Transacao[] = [];

  mostrarModal = false;

  novaReceita = {
    descricao: '',
    valor: 0,
    tipo: 'RECEITA',
    dataPrevistaRecebimento: ''
  };
    mostrarModalDespesa = false;
  novaDespesa = {
    descricao: '',
    valor: 0,
    dataVencimento: '',
    tipo: 'DESPESA',
    paga: false
  };


  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadTransacoes();
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  loadTransacoes() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const filtro = {};

    this.http.post<Transacao[]>('http://localhost:8080/transacoes/filtrar', filtro, { headers })
      .subscribe({
        next: data => this.transacoes = data,
        error: err => {
          console.error('Erro ao carregar transações:', err);
          if (err.status === 401 || err.status === 403) {
            this.logout();
          }
        }
      });
  }

  abrirModal() {
    this.novaReceita = {
      descricao: '',
      valor: 0,
      tipo: 'RECEITA',
      dataPrevistaRecebimento: ''
    };
    this.mostrarModal = true;
  }

  fecharModal() {
    this.mostrarModal = false;
  }
  abrirModalDespesa() {
    this.mostrarModalDespesa = true;
  }

  fecharModalDespesa() {
    this.mostrarModalDespesa = false;
    this.novaDespesa = { descricao: '', valor: 0, dataVencimento: '', paga: false, tipo: '' };
  }

  salvarReceita() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post('http://localhost:8080/transacoes', this.novaReceita, { headers })
      .subscribe({
        next: () => {
          this.fecharModal();
          this.loadTransacoes();
        },
        error: err => {
          console.error('Erro ao salvar receita:', err);
        }
      });
  }

    salvarDespesa() {
    const token = localStorage.getItem('token');
    console.log(this.novaDespesa)
    if (!token) {
      this.logout();
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post('http://localhost:8080/transacoes', this.novaDespesa, { headers })
      .subscribe({
        next: () => {
          this.fecharModalDespesa();
          this.loadTransacoes();
        },
        error: err => {
          console.error('Erro ao salvar despesa:', err);
        }
      });
  }
}
