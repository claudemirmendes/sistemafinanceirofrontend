import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

interface Transacao {
   id: number;
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

mostrarModalConfirmar = false;
transacaoParaConfirmar: Transacao | null = null;
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
    alert(this.novaDespesa)
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

  
  abrirModalConfirmacao(transacao: Transacao) {
  this.transacaoParaConfirmar = transacao;
  this.mostrarModalConfirmar = true;
}

fecharModalConfirmar() {
  this.mostrarModalConfirmar = false;
  this.transacaoParaConfirmar = null;
}
dataPagamento: string = '';

mostrarModalRecebimento: boolean = false;

dataRecebimento: string = '';


abrirModalRecebimento(transacao: any) {
  this.transacaoParaConfirmar = transacao;
  this.dataRecebimento = ''; // limpa campo
  this.mostrarModalRecebimento = true;
}

confirmarPagamementoFinal() {
  if (!this.dataPagamento) {
    Swal.fire('Erro', 'Informe a data de pagamento.', 'warning');
    return;
  }

  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  const body = {
    dataPagamento: this.dataPagamento
  };

  this.http.put(`http://localhost:8080/transacoes/${this.transacaoParaConfirmar?.id}/confirmar-pagamento`, body, { headers })
    .subscribe({
      next: () => {
  Swal.fire('Sucesso!', 'Pagamento confirmado com sucesso.', 'success')
    .then(() => {
      this.fecharModalConfirmar(); // callback após usuário fechar o alerta
    });

  this.mostrarModalConfirmar = false;
  this.loadTransacoes();
},
      error: (err) => {
        console.error('Erro ao confirmar pagamento:', err);
        Swal.fire('Erro!', 'Erro ao confirmar pagamento.', 'error');
      }
    });
}
confirmarRecebimentoFinal() {
  if (!this.dataRecebimento) {
    Swal.fire('Erro', 'Informe a data de recebimento.', 'warning');
    return;
  }

  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  const body = {
    dataRecebimento: this.dataRecebimento
  };

  this.http.put(`http://localhost:8080/transacoes/${this.transacaoParaConfirmar?.id}/confirmar-recebimento`, body, { headers })
    .subscribe({
      next: () => {
  Swal.fire('Sucesso!', 'Recebimento confirmado com sucesso.', 'success')
    .then(() => {
      this.fecharModalRecebimento(); // callback após usuário fechar o alerta
    });

  this.mostrarModalRecebimento = false;
  this.loadTransacoes();
},
      error: (err) => {
        console.error('Erro ao confirmar recebimento:', err);
        Swal.fire('Erro!', 'Erro ao confirmar recebimento.', 'error');
      }
    });
}

fecharModalRecebimento() {
  this.mostrarModalConfirmar = false;
  this.transacaoParaConfirmar = null;
  this.dataRecebimento = '';
}

mostrarModalEditar = false;
transacaoEditada: Transacao = {
  id: 0, // não: id: number
  tipo: '',
  valor: 0,
  descricao: '',
  dataPrevistaRecebimento: null,
  dataRecebida: null,
  confirmada: null,
  dataVencimento: null,
  dataPagamento: null,
  paga: null
};
abrirModalEditar(transacao: Transacao) {
  // Clona para não alterar direto na lista
  this.transacaoEditada = { ...transacao };
  this.mostrarModalEditar = true;
}




fecharModalEditar() {
  this.mostrarModalEditar = false;
}

salvarEdicao() {
  const token = localStorage.getItem('token');
  if (!token) {
    this.logout();
    return;
  }

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  if (!this.transacaoEditada.id) {
    alert('Transação sem ID para atualização');
    return;
  }

  const {
    id,
    tipo, // excluído do corpo para evitar alterar no backend
    ...dadosAtualizacao
  } = this.transacaoEditada;

  this.http.put<Transacao>(
    `http://localhost:8080/transacoes/${id}/atualizar`,
    dadosAtualizacao,
    { headers }
  ).subscribe({
    next: (transacaoAtualizada) => {
      Swal.fire('Sucesso!', `${tipo} atualizada com sucesso`, 'success');
      console.log('Transação atualizada:', transacaoAtualizada);
      this.fecharModalEditar();
      this.loadTransacoes();
    },
    error: (err) => {
      console.error('Erro ao atualizar transação:', err);
      alert(err?.error || '');
      Swal.fire('Erro!', 'Erro ao atualizar transação', 'error');
    }
  });
}

filtro = {
  tipo: '',
  descricao: '',
  dataVencimentoInicio: '',
  dataVencimentoFim: '',
  dataPagamentoInicio: '',
  dataPagamentoFim: '',
  dataPrevistaInicio: '',
  dataPrevistaFim: '',
  dataRecebimentoInicio: '',
  dataRecebimentoFim: '',
  paga: '',
  valorMin: '',
  valorMax: ''
};

aplicarFiltros() {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  // Cria novo objeto contendo apenas os filtros preenchidos
  const filtrosLimpos: any = Object.fromEntries(
    Object.entries(this.filtro).filter(([_, valor]) => valor !== null && valor !== '')
  );

  this.http.post<Transacao[]>('http://localhost:8080/transacoes/filtrar', filtrosLimpos, { headers })
    .subscribe({
      next: data => this.transacoes = data,
      error: err => {
        console.error('Erro ao filtrar transações:', err);
      }
    });
}

limparFiltros() {
  this.filtro = {
    tipo: '',
    descricao: '',
    dataVencimentoInicio: '',
    dataVencimentoFim: '',
    dataPagamentoInicio: '',
    dataPagamentoFim: '',
    dataPrevistaInicio: '',
    dataPrevistaFim: '',
    dataRecebimentoInicio: '',
    dataRecebimentoFim: '',
    paga: '',
    valorMin: '',
    valorMax: ''
  };
  this.aplicarFiltros();
}
}
