import { Injectable } from '@angular/core';
import { LinkedListService } from '../services/linked-list.service';
import { NodoService } from '../services/nodo.service';
import { ElementoGramService } from '../services/elemento-gram.service';

@Injectable({
  providedIn: 'root'
})
export class AnalizadorGramaticalService {

  cadena: string[] = [];
  file: any;
  nAnulables: string[] = [];
  producAnulables: number[] = [];
  producciones: LinkedListService<NodoService>[] = [];
  elementoGram: ElementoGramService[] = [];
  noTerminales: string[] = [];
  primerosProd: string[][] = [];

  constructor() { }

  isFormaEspecial(valor: LinkedListService<NodoService>[]) {
    let especial = true;
    for (let produccion of valor) {
      let condicion1 = false;
      let condicion2 = false;
      let head = produccion.obtenerHead();
      if (head.next.value.getValue() === '!') {
        condicion1 = true;
      } else if (head.next.value.getTipo() === 'T') {
        let nodo = head.next;
        if (nodo.next === null) {
          condicion2 = false;
        } else if ((nodo.next.value.getTipo() === 'N') && (nodo.next.next === null)) {
          condicion2 = true;
        } else {
          condicion2 = false;
        }
      }
      if (condicion1 || condicion2) {
        especial = true;
      } else {
        especial = false;
        return especial;
      }
    }
    return especial;
  }

  alfaDerecha(produccion: LinkedListService<NodoService>) {
    let isFull = true;
    let nodo = produccion.obtenerHead().next;
    let condicion = true;
    if (nodo !== null) {
      if (nodo.next === null && nodo.value.getTipo() === 'N') {
        condicion = true;
        return condicion;
      } else if (nodo.next !== null && nodo.value.getTipo() === 'N') { // Se controla que un N no sea final
        condicion = false;
        return condicion;
      } else { // todos son terminales
        condicion = true;
      }
    }
    return condicion;
  }

  // Cond 1: Todas las producciones comienzan con no terminal
  // Cond 2: las producciones que empiezan por el mismo N, comienzan por diferente terminal
  isGramS(producciones: LinkedListService<NodoService>[]) {
    let s = true;
    for (let produccion of producciones) {
      let nodo = produccion.obtenerHead().next.value;
      this.noTerminales.push((produccion.obtenerHead().value.getValue()));
      if ((nodo.getValue() === '!') || (nodo.getTipo() === 'N')) {
        s = false;
        return s;
      }
    }
    for (let N of this.noTerminales) {
      let term: string[] = [];
      let contador = 0;
      for (let produccion of producciones) {
        if (N === produccion.obtenerHead().value.getValue()) {
          contador ++;
          let terminal = produccion.obtenerHead().next.value.getValue();
          if (term.indexOf(terminal) < 0) {
            term.push(terminal);
          }
        }
      }
      if (term.length !== contador) {
        s = false;
        return s;
      }
    }
    return s;
  }

  isLinealXDerecha(valor: LinkedListService<NodoService>[]) {
    let derecha = true;
    let especial = this.isFormaEspecial(valor);
    if (especial) {
      derecha = true;
      return derecha;
    } else {
      for (let produccion of valor) {
        let condicion1 = false;
        let condicion2 = false;
        let head = produccion.obtenerHead();
        if (head.next.value.getValue() === '!') {
          condicion1 = true;
        } else {
          condicion2 = this.alfaDerecha(produccion);
        }
        if (condicion1 || condicion2) {
          derecha = true;
        } else {
          derecha = false;
          return derecha;
        }
      }
    }
    return derecha;
  }
}
