import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'encurtarNome',
  standalone: true
})
export class EncurtarNomePipe implements PipeTransform {

  transform(nome: string): string {
    let arrayNome = nome.split(' ');
    if(arrayNome.length > 0) return `${arrayNome[0]} ${arrayNome[1] ? `${arrayNome[1]}` : ''}`;
    else return '';
  }

}
