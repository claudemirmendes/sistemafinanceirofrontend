import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // importa só o outlet para o router funcionar
  template: `
    <router-outlet></router-outlet>
  `
})
export class App {}
