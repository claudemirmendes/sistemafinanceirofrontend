import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../service/service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, MatSnackBarModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export default class LoginComponent {
  username = '';
  password = '';

  constructor(
    private authService: AuthService,  
    private http: HttpClient,
    private snackBar: MatSnackBar,
     private router: Router,
     
  ) {
  const token = localStorage.getItem('token');
  if (token) {
    this.router.navigate(['/dashboard']);
  }
  }

login() {
  this.authService.login(this.username, this.password).subscribe({
    next: (response: any) => {
      this.authService.saveToken(response.token); // salva o token no localStorage
      this.snackBar.open(response.message || 'Login efetuado com sucesso!', 'Fechar', {
        duration: 5000,
        panelClass: ['snackbar-success'],
      });
      // redirecionar para a rota protegida depois do login
      this.router.navigate(['/dashboard']);
    },
    error: (error: HttpErrorResponse) => {
      const errorMsg = typeof error.error === 'string' ? error.error : 'Erro ao realizar login.';
      this.snackBar.open(errorMsg, 'Fechar', {
        duration: 5000,
        panelClass: ['snackbar-error'],
      });
    }
  });
}

}
