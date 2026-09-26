import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface UsuarioPerfil {
  email: string;
  nombre: string;
  preferencias: string;
}

export interface SyncUsuarioRequest {
  nombre?: string;
  preferencias?: string;
}

@Injectable({ providedIn: 'root' })
export class Users {
  private http = inject(HttpClient);
  private baseUrl = `${environment.bffApiUrl}/usuarios`;

  sync(request: SyncUsuarioRequest) {
    return this.http.post<UsuarioPerfil>(`${this.baseUrl}/sync`, request);
  }

  me() {
    return this.http.get<UsuarioPerfil>(`${this.baseUrl}/me`);
  }
}