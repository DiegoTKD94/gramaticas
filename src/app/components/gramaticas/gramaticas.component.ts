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

  constructor(// private lista: LinkedListService<NodoService>,
              // private nodo: NodoService
              ) { }

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

  // Crea la lista ligada con las producciones (Adecuar las listas ligadas)
  construyeLista(lista: string[]) {
    for (let i = 0; i <= (lista.length - 1); i++) {
      let estado = 1;
      let elemento = ''; // Guardará cada terminal y no terminal
      let listaProduccion = new LinkedListService<NodoService>();
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
              let nodo = new NodoService(elemento, 'N');
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
              let nodo = new NodoService(elemento, 'T');
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
                let nodo = new NodoService(elemento, 'T');
                listaProduccion.append(nodo);
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
                let nodo = new NodoService(elemento, 'N');
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
              let nodo = new NodoService(elemento, 'T');
              listaProduccion.append(nodo);
              break;
            }
            // if ((lista[i][j] !== '~') && (lista[i][j] !== '<') && (lista[i][j] !== '>') && (lista[i][j] !== '!') && !nulo) {
            //   console.log('avanzó');
            //   estado = 5;
            //   elemento = lista[i][j];
            //   let nodo = new NodoService(elemento, 'T');
            //   listaProduccion.append(nodo);
            //   break;
            // } else if (lista[i][j] === '<') {
            //   console.log('avanzó');
            //   estado = 7;
            //   elemento = lista[i][j];
            //   break;
            // }
        }
      }
      console.log(listaProduccion.toArray());
    }
  }

  docCadena() {
    const value: string = this.gramaticas.controls.manual.value;
    this.gramPrevia(value);
    console.log(this.cadena);
    this.construyeLista(this.cadena);
  }
}

