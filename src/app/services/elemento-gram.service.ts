import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ElementoGramService {

  valor: string;
  primeros: string[];
  siguientes: string[];

  constructor(valor) {
    this.valor = valor;
    this.primeros = [];
    this.siguientes = [];
  }

  concatPrimero(valor) {
    this.primeros = this.primeros.concat(valor);
  }

  getValor() {
    return this.valor;
  }

  getPrimeros() {
    return this.primeros;
  }

  getSiguientes() {
    return this.siguientes;
  }

  addPrimero(valor: string) {
    this.primeros.push(valor);
  }

  addSiguiente(valor: string) {
    this.siguientes.push(valor);
  }



}
