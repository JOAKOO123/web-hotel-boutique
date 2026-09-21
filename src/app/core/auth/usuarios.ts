import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface UsuarioResponse {
  email: string;
  nombre: string;
  preferencias: string;
}

@Injectable({ providedIn: 'root' })
export class Usuarios {
  private http = inject(HttpClient);
  private baseUrl = `${environment.usuariosApiUrl}/usuarios`;

  sync(nombre: string, preferencias: string = '') {
    return this.http.post<UsuarioResponse>(`${this.baseUrl}/sync`, { nombre, preferencias });
  }

  getMe() {
    return this.http.get<UsuarioResponse>(`${this.baseUrl}/me`);
  }
}
