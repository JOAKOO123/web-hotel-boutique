import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export interface CrearColaRequest {
  nombre: string;
  durable: boolean;
}

export interface CrearExchangeRequest {
  nombre: string;
  tipo: 'direct' | 'topic';
  durable: boolean;
}

export interface CrearBindingRequest {
  exchange: string;
  cola: string;
  routingKey: string;
}

@Injectable({ providedIn: 'root' })
export class RabbitAdmin {
  private http = inject(HttpClient);
  private baseUrl = `${environment.bffApiUrl}/api/admin`;

  crearCola(body: CrearColaRequest) {
    return this.http.post(`${this.baseUrl}/queues`, body, { responseType: 'text' });
  }

  eliminarCola(nombre: string) {
    return this.http.delete(`${this.baseUrl}/queues/${encodeURIComponent(nombre)}`, { responseType: 'text' });
  }

  crearExchange(body: CrearExchangeRequest) {
    return this.http.post(`${this.baseUrl}/exchanges`, body, { responseType: 'text' });
  }

  eliminarExchange(nombre: string) {
    return this.http.delete(`${this.baseUrl}/exchanges/${encodeURIComponent(nombre)}`, { responseType: 'text' });
  }

  crearBinding(body: CrearBindingRequest) {
    return this.http.post(`${this.baseUrl}/bindings`, body, { responseType: 'text' });
  }

  eliminarBinding(body: CrearBindingRequest) {
    const params = new HttpParams({
      fromObject: { exchange: body.exchange, cola: body.cola, routingKey: body.routingKey }
    });
    return this.http.delete(`${this.baseUrl}/bindings`, { params, responseType: 'text' });
  }
}
