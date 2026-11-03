import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { RabbitAdmin } from './rabbit-admin';
import { environment } from '../../../../environments/environment';

describe('RabbitAdmin', () => {
  let service: RabbitAdmin;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(RabbitAdmin);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('crea una cola con POST a /api/admin/queues', () => {
    service.crearCola({ nombre: 'q.prueba', durable: true }).subscribe();

    const req = http.expectOne(`${environment.bffApiUrl}/api/admin/queues`);
    expect(req.request.method).toBe('POST');
    req.flush('', { status: 201, statusText: 'Created' });
  });

  it('elimina un binding enviando los parametros en la consulta', () => {
    service.eliminarBinding({ exchange: 'hotel.eventos', cola: 'q.tickets', routingKey: 'reserva.#' }).subscribe();

    const req = http.expectOne(r => r.url === `${environment.bffApiUrl}/api/admin/bindings`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.params.get('routingKey')).toBe('reserva.#');
    req.flush('', { status: 204, statusText: 'No Content' });
  });
});
