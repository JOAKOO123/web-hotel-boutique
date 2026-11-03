import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { RabbitAdmin } from './rabbit-admin';

type Mensaje = { tipo: 'ok' | 'error'; texto: string } | null;

@Component({
  selector: 'app-rabbitmq-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './rabbitmq-admin.html',
  styleUrl: './rabbitmq-admin.scss'
})
export class RabbitmqAdmin {
  private api = inject(RabbitAdmin);

  mensaje = signal<Mensaje>(null);
  ocupado = signal(false);

  cola = { nombre: '', durable: true };
  exchange = { nombre: '', tipo: 'topic' as 'direct' | 'topic', durable: true };
  binding = { exchange: '', cola: '', routingKey: '' };
  eliminarCola = { nombre: '' };
  eliminarExchange = { nombre: '' };
  eliminarBinding = { exchange: '', cola: '', routingKey: '' };

  crearCola(): void {
    this.ejecutar(this.api.crearCola({ ...this.cola }), `Cola "${this.cola.nombre}" creada.`);
  }

  crearExchange(): void {
    this.ejecutar(this.api.crearExchange({ ...this.exchange }), `Exchange "${this.exchange.nombre}" creado.`);
  }

  crearBinding(): void {
    this.ejecutar(this.api.crearBinding({ ...this.binding }), 'Binding creado.');
  }

  borrarCola(): void {
    this.ejecutar(this.api.eliminarCola(this.eliminarCola.nombre), `Cola "${this.eliminarCola.nombre}" eliminada.`);
  }

  borrarExchange(): void {
    this.ejecutar(this.api.eliminarExchange(this.eliminarExchange.nombre), `Exchange "${this.eliminarExchange.nombre}" eliminado.`);
  }

  borrarBinding(): void {
    this.ejecutar(this.api.eliminarBinding({ ...this.eliminarBinding }), 'Binding eliminado.');
  }

  private ejecutar(operacion: Observable<unknown>, textoOk: string): void {
    this.ocupado.set(true);
    this.mensaje.set(null);
    operacion.subscribe({
      next: () => {
        this.mensaje.set({ tipo: 'ok', texto: textoOk });
        this.ocupado.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.mensaje.set({ tipo: 'error', texto: this.textoError(err) });
        this.ocupado.set(false);
      }
    });
  }

  private textoError(err: HttpErrorResponse): string {
    switch (err.status) {
      case 400: return this.detalleValidacion(err);
      case 401: return 'Tu sesión expiró. Vuelve a iniciar sesión.';
      case 403: return 'Tu usuario no tiene permisos de administrador.';
      case 404: return 'El recurso no existe en RabbitMQ.';
      default: return 'No se pudo completar la operación. Revisa el servicio de administración.';
    }
  }

  private detalleValidacion(err: HttpErrorResponse): string {
    try {
      const cuerpo = JSON.parse(String(err.error));
      if (Array.isArray(cuerpo.detalles) && cuerpo.detalles.length) {
        return cuerpo.detalles.join(' · ');
      }
      return cuerpo.error ?? 'Datos inválidos.';
    } catch {
      return 'Datos inválidos.';
    }
  }
}
