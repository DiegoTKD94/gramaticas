import { Injectable } from '@angular/core';
import { NodoGram } from '../interfaces/nodo-gram.interface';


@Injectable({
  providedIn: 'root'
})
export class NodoService {

  nodo: NodoGram;

  constructor(valor, tipo) {
    this.nodo = {
      valor,
      tipo
    };
  }

  regresaNodo() {
    return this.nodo;
  }

  asignaValores(valor, tipo) {
    this.nodo = {
      valor,
      tipo
    };
  }

  formateaNodo() {
    this.nodo = {
      valor: '',
      tipo: '',
    };
  }
}
