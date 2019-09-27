import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-gramaticas',
  templateUrl: './gramaticas.component.html',
  styles: []
})
export class GramaticasComponent implements OnInit {

  cadena: string[] = [];
  fileContent: any = '';

  constructor() { }

  gramaticas = new FormGroup({
    manual: new FormControl(''),
    archivo: new FormControl(''),
  });

  lector(fileList: FileList) {
    let file = fileList[0];
    let fileReader: FileReader = new FileReader();
    fileReader.onloadend = (x) => {
      this.fileContent = fileReader.result;
      return this.fileContent;
    };
    fileReader.readAsText(file);
    console.log(this.fileContent);
    console.log(fileList);
  }

  ngOnInit() {
  }

  pruebaTxt() {
    console.log(this.gramaticas.controls.archivo);
  }

  docCadena() {
    const value: string = this.gramaticas.controls.manual.value;
    let nroElementos = 0;
    nroElementos = value.length;
    for (let caracter of value) {
      console.log(caracter);
      if (caracter === '\n') { // Con esto se diferencia cuando hay un espacio en blanco
        console.log('1');
      }
    }
  }
}

