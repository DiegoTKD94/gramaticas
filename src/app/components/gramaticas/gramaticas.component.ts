import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LinkedListService } from '../../services/linked-list.service';
import { NodoGram } from '../../interfaces/nodo-gram.interface';
import { NodoService } from '../../services/nodo.service';
import { THIS_EXPR, ClassField } from '@angular/compiler/src/output/output_ast';




@Component({
  selector: 'app-gramaticas',
  templateUrl: './gramaticas.component.html',
  styles: []
})
export class GramaticasComponent implements OnInit {

  cadena: string[] = [];
  file: any;
  nAnulables: string[] = [];
  producciones: LinkedListService<NodoService>[] = [];

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
    for (let produccion of this.producciones) {
      let siguiente = produccion.obtenerHead();
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

  docCadena() {
    const value: string = this.gramaticas.controls.manual.value;
    this.gramPrevia(value);
    console.log(this.cadena);
    this.construyeLista(this.cadena);
    this.primRecorrido();
    this.segundoRecorrido();
    console.log(this.nAnulables);
  }
}

