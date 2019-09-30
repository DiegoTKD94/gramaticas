import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LinkedListService } from '../../services/linked-list.service';
import { NodoGram } from '../../interfaces/nodo-gram.interface';
import { NodoService } from '../../services/nodo.service';
import { THIS_EXPR, ClassField } from '@angular/compiler/src/output/output_ast';
import { ElementoGramService } from '../../services/elemento-gram.service';




@Component({
  selector: 'app-gramaticas',
  templateUrl: './gramaticas.component.html',
  styles: []
})
export class GramaticasComponent implements OnInit {

  cadena: string[] = [];
  file: any;
  nAnulables: string[] = [];
  producAnulables: number[] = [];
  producciones: LinkedListService<NodoService>[] = [];
  elementoGram: ElementoGramService[] = [];
  noTerminales: string[] = [];

  constructor() { }

  gramaticas = new FormGroup({
    manual: new FormControl(''),
    archivo: new FormControl(''),
  });

  // Usado para la lectura desde .txt
  fileChanged(e) {
    this.file = e.target.files[0];
    console.log(this.file);
  }

  // Usada para la lectura desde .txt
  uploadDocument(file) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      console.log(fileReader.result);
    };
    fileReader.readAsText(this.file);
  }

  ngOnInit() {
  }

  pruebaTxt() {
    console.log(this.gramaticas.controls.archivo);
  }

  // Indexa cada una de las producciones, no ha hecho validación
  gramPrevia(valor: string) {
    let contador = 0;
    let previa = '';
    for (let i = 0; i <= (valor.length - 1); i++) {
      if (valor[i] !== '\n') {
        previa = previa + valor[i];
        this.cadena[contador] = previa;
      } else if (valor[i] === '\n' && previa === '') {
        console.log('1');
      } else {
        this.cadena[contador] = previa;
        previa = '';
        contador++;
      }
    }
  }

  nAnulablesIniciales(nodo: any) {
    let aparece = false;
    if (this.nAnulables.length === 0) {
      this.nAnulables.push(nodo);
    } else {
      for (let valor of this.nAnulables) {
        if (valor === nodo) {
          aparece = true;
        }
      }
      if (!aparece) {
        this.nAnulables.push(nodo);
      }
    }
  }

  primRecorrido() {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.producciones.length; i++) {
      let siguiente = this.producciones[i].obtenerHead();
      while (siguiente !== null) {
        for (let noTerm of this.nAnulables) {
          if (siguiente.value.getValue() === noTerm) {
            siguiente.value.modifAnulables(true);
          }
        }
        siguiente = siguiente.next;
      }
    }
  }

  segundoRecorrido() {
    for (let produccion of this.producciones) {
      let anulable = true;
      let siguiente = produccion.obtenerHead();
      let primero = siguiente.next;
      let aparece = false;
      while (primero !== null) {
        if (primero.value.getAnulable() === false) {
          anulable = false;
        }
        primero = primero.next;
      }
      if (anulable && (siguiente.value.getAnulable() === false)) {
        siguiente.value.modifAnulables(true);
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.nAnulables.length; i++) {
          if (siguiente.value.getValue() === this.nAnulables[i]) {
            aparece = true;
          }
        }
        if (aparece === false) {
          this.nAnulables.push(siguiente.value.getValue());
        }
        this.primRecorrido();
        this.segundoRecorrido();
      }
    }
  }

  produccionesAnu() {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.producciones.length; i++) {
      let anulable = true;
      let siguiente = this.producciones[i].obtenerHead();
      while (siguiente !== null) {
        if (siguiente.value.getAnulable() === false) {
          anulable = false;
        }
        siguiente = siguiente.next;
      }
      if (anulable === true) {
        this.producAnulables.push(i);
      }
    }
  }

  // Crea la lista ligada con las producciones (Adecuar las listas ligadas)
  construyeLista(lista: string[]) {
    for (let i = 0; i <= (lista.length - 1); i++) {
      let estado = 1;
      let elemento = ''; // Guardará cada terminal y no terminal
      let listaProduccion = new LinkedListService<NodoService>();
      this.producciones.push(listaProduccion);
      let nulo = false;
      for (let j = 0; j <= (lista[i].length - 1); j++) {
        switch (estado) {
          case 1:
            if (lista[i][0] !== '<') {
              estado = 10; // Puede ser el estado de error
              console.log('error');
              return;
            } else {
              estado = 2;
              elemento = elemento + lista[i][0];
              break;
            }
          case 2:
            if (lista[i][j] === ('>' || '~' || '!')) {
              estado = 10;
              console.log('error');
              return;
            } else {
              estado = 3;
              elemento = elemento + lista[i][j];
              break;
            }
          case 3:
            if (lista[i][j] === ('<' || '~' || '!')) {
              estado = 10;
              console.log('error');
              return;
            } else if (lista[i][j] === '>') {
              estado = 4;
              elemento = elemento + lista[i][j];
              console.log(elemento);
              break;
            } else {
              estado = 3;
              elemento = elemento + lista[i][j];
              break;
            }
          case 4:
            if (lista[i][j] === '~') {
              estado = 5;
              let nodo = new NodoService(elemento, 'N', false);
              listaProduccion.append(nodo);
              elemento = '';
              break;
            } else {
              estado = 10;
              console.log('error');
              return;
            }
          case 5:
            // Condicion: (lista[i][j] !== '~') && (lista[i][j] !== '<') && (lista[i][j] !== '>') && (lista[i][j] !== '!')
            if ((lista[i][j] !== '~') && (lista[i][j] !== '<') && (lista[i][j] !== '>') && (lista[i][j] !== '!')) { // letra
              estado = 5;
              elemento = lista[i][j];
              let nodo = new NodoService(elemento, 'T', false);
              listaProduccion.append(nodo);
              nulo = true; // Condiciona que no haya secuencia nula despues de un no terminal
              break;
            } else if (lista[i][j] === '<') { // Se inicia el reconocimiento de un no terminal
              estado = 7;
              elemento = lista[i][j];
              break;
            } else if (lista[i][j] === '!') {
              if (nulo) {
                estado = 10;
                estado = 10;
                console.log('error');
                return;
              } else {
                estado = 6;
                elemento = lista[i][j];
                let nodo = new NodoService(elemento, 'T', true);
                listaProduccion.append(nodo);
                listaProduccion.obtenerHead().value.modifAnulables(true);
                this.nAnulablesIniciales(listaProduccion.obtenerHead().value.getValue());
                console.log(this.nAnulables);
                nulo = true;
                console.log('ok');
                break;
              }
            } else {
                estado = 10;
                console.log('error EST5');
                return;
            }
          case 6:
            if (nulo) {
              estado = 10;
              console.log('error');
              return;
            }
            break;
          case 7:
            if (lista[i][j] === ('>' || '~' || '!' || '<')) {
              estado = 10;
              console.log('error');
              return;
            } else {
              estado = 8;
              elemento = elemento + lista[i][j];
              break;
            }
          case 8:
              if (lista[i][j] === ('<' || '~' || '!')) {
                estado = 10;
                console.log('error');
                return;
              } else if (lista[i][j] === '>') {
                estado = 9;
                elemento = elemento + lista[i][j];
                let nodo = new NodoService(elemento, 'N', false);
                listaProduccion.append(nodo);
                elemento = '';
                break;
              } else {
                estado = 8;
                elemento = elemento + lista[i][j];
                break;
              }
          case 9:
            if (lista[i][j] === '<') {
              estado = 7;
              elemento = lista[i][j];
              break;
            } else if (lista[i][j] === ('!' || '~' || '>')) {
              estado = 10;
              console.log('error');
              return;
            } else {
              estado = 5;
              elemento = lista[i][j];
              let nodo = new NodoService(elemento, 'T', false);
              listaProduccion.append(nodo);
              break;
            }
        }
      }
      console.log(listaProduccion.toArray());
    }
    console.log(this.producciones);
  }

  obtenerElementoGram() {
    let added: string[] = [];
    for (let produccion of this.producciones) {
      let valor = produccion.obtenerHead().value.getValue();
      if (added.indexOf(valor) < 0) {
        added.push(valor);
        let elemento = new ElementoGramService(valor);
        this.elementoGram.push(elemento);
      }
    }
  }

  primeros() {
    for (let produccion of this.producciones) {
      // tslint:disable-next-line: prefer-for-of
      let indice: number;
      let terminal = false;
      let siguiente = produccion.obtenerHead().next;
      let actual = produccion.obtenerHead().value.getValue();
      for (let j = 0; j < this.elementoGram.length; j++) {
        if (this.elementoGram[j].getValor() === produccion.obtenerHead().value.getValue()) {
          indice = j;
          break;
        }
      }
      if ((siguiente.value.getTipo() === 'T') && (siguiente.value.getValue() !== '!')) { // El valor es un terminal
        console.log('Entro');
        this.elementoGram[indice].addPrimero(siguiente.value.getValue());
      } else if (siguiente.value.getValue() !== '!') { // El nodo es un no terminal
          while (terminal === false) {
            if (siguiente.value.getValue() !== actual) { // No es el mismo nodo
              this.elementoGram[indice].addPrimero(siguiente.value.getValue());
              if (siguiente.value.getTipo() === 'T') {
                terminal = true;
              }
            }
            if (siguiente.next === null) {
              break;
            }
          }
      }
    }
  }

  noTerm() {
    for (let produccion of this.producciones) {
      if (this.noTerminales.indexOf(produccion.obtenerHead().value.getValue()) < 0) {
        this.noTerminales.push(produccion.obtenerHead().value.getValue());
      }
    }
  }

  primerosNuevo(noTerminales) {
    for (let N of noTerminales) {
      console.log(this.nuevoPrimerInd(N));
    }
  }

  nuevoPrimerInd(valor) {
    let primerosValue: string[] = [];
    for (let produccion of this.producciones) {
      if (produccion.obtenerHead().value.getValue() === valor) {
        let nodo = produccion.obtenerHead().next;
        let tipo = nodo.value.getTipo();
        switch (tipo) {
          case 'T':
            if (nodo.value.getValue() !== '!') {
              primerosValue.push(nodo.value.getValue());
            }
            break;
          case 'N':
              if (nodo.value.getAnulable() === true) {
                  let lista = [];
                  let proximos = [];
                  let anulable = true;
                  lista = this.nuevoPrimerInd(nodo.value.getValue());
                  primerosValue = primerosValue.concat(lista);
                  while (anulable && (nodo !== null) && (nodo.next !== null)) {
                    nodo = nodo.next;
                    proximos.push(nodo.value.getValue());
                    if (nodo.value.getTipo() === 'T') {
                      primerosValue.push(nodo.value.getValue());
                    }
                    if (nodo.value.getAnulable() === false) {
                      anulable = false;
                    }
                  }
                  for (let elemento of proximos) {
                    lista = this.nuevoPrimerInd(elemento);
                    primerosValue = primerosValue.concat(lista);
                  }
                  console.log('Estos son :' + proximos);
              }
              if (nodo.value.getAnulable() === false) {
                primerosValue.push(nodo.value.getValue());
              }
              break;
        }
      }
    }
    return primerosValue;
  }

  primeroInd(valor) {
    let indice: number;
    for (let j = 0; j < this.elementoGram.length; j++) {
      if (this.elementoGram[j].getValor() === valor) {
        indice = j;
        break;
      }
    }
    return this.elementoGram[indice].getPrimeros();
  }

  docCadena() {
    const value: string = this.gramaticas.controls.manual.value;
    this.gramPrevia(value);
    console.log(this.cadena);
    this.construyeLista(this.cadena);
    this.primRecorrido();
    this.segundoRecorrido();
    this.produccionesAnu();
    this.obtenerElementoGram();
    console.log(this.nAnulables);
    console.log(this.producAnulables);
    console.log('Añadidos: ');
    this.noTerm();
    this.primerosNuevo(this.noTerminales);
  }
}

