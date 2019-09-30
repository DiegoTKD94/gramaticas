import { Injectable } from '@angular/core';
import { NodoGram } from '../interfaces/nodo-gram.interface';


@Injectable({
  providedIn: 'root'
})
export class NodoService {

  nodo: NodoGram;

  constructor(valor, tipo, anulable) {
    this.nodo = {
      valor,
      tipo,
      anulable
    };
  }

  regresaNodo() {
    return this.nodo;
  }

  asignaValores(valor, tipo, anulable) {
    this.nodo = {
      valor,
      tipo,
      anulable
    };
  }

  getValue() {
    return this.nodo.valor;
  }

  getAnulable() {
    return this.nodo.anulable;
  }

  modifAnulables(value) {
    this.nodo.anulable = value;
  }

  formateaNodo() {
    this.nodo = {
      valor: '',
      tipo: '',
      anulable: false,
    };
  }
}
