import { AbstractControl, Validators } from "@angular/forms";

export class CustomValidators {

  constructor() {}

  static isValidCpf() {
    return (control: AbstractControl): Validators | null => {
      let cpf = control.value.replace('.', '');
      cpf = control.value.replace('-', '');
      if (cpf) {
        let numbers, digits, sum, i, result, equalDigits;
        equalDigits = 1;
        if (cpf.length < 11) {
         return null;
        }

        for (i = 0; i < cpf.length - 1; i++) {
          if (cpf.charAt(i) !== cpf.charAt(i + 1)) {
            equalDigits = 0;
            break;
          }
        }

        if (!equalDigits) {
          numbers = cpf.substring(0, 9);
          digits = cpf.substring(9);
          sum = 0;
          for (i = 10; i > 1; i--) {
            sum += numbers.charAt(10 - i) * i;
          }

          result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

          if (result !== Number(digits.charAt(0))) {
            return { cpfNotValid: true };
          }
          numbers = cpf.substring(0, 10);
          sum = 0;

          for (i = 11; i > 1; i--) {
            sum += numbers.charAt(11 - i) * i;
          }
          result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

          if (result !== Number(digits.charAt(1))) {
            return { cpfNotValid: true };
          }
          return null;
        } else {
          return { cpfNotValid: true };
        }
      }
      return null;
    };
  }

  static validarSenha() {
    return (control: AbstractControl): Validators | null => {
      let msgValidacao = "Necessário: 8 caracteres, letra maiúscula, letra minúscula,"
                          + " número, caracter especial";
      let inputSenha = control.value;

      const letras = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z";
      const numeros = "0,1,2,3,4,5,6,7,8,9";
      const numerosArray = numeros.split(',');
      const letrasMinusculas = letras.split(',');
      const letrasMaiusculas = letras.toUpperCase().split(',');
      const caracteresEspeciais = [
        '!', '@', '#', '$', '%', '^', '&', '*', '(', ')',
        '[', ']', '{', '}', '<', '>', '|', '\\', '/',
        ':', ';', ',', '.', '?', '-', '_', '+', '=', '~'
      ];

      if(inputSenha.length >= 8) {
        msgValidacao = msgValidacao.replace(' 8 caracteres', '');
      }
      letrasMaiusculas.forEach(i => {
        if(inputSenha.includes(i)) {
          msgValidacao = msgValidacao.replace(', letra maiúscula', '');
        }
      });
      letrasMinusculas.forEach(i => {
        if(inputSenha.includes(i)) {
          msgValidacao = msgValidacao.replace(', letra minúscula', '');
        }
      });
      numerosArray.forEach(i => {
        if(inputSenha.includes(i)) {
          msgValidacao = msgValidacao.replace(', número', '');
        }
      });
      caracteresEspeciais.forEach(i => {
        if(inputSenha.includes(i)) {
          msgValidacao = msgValidacao.replace(', caracter especial', '');
        }
      });
      if(inputSenha.includes(' ')) {
        msgValidacao = 'Não é permitido espaços em branco';
      }

      if(msgValidacao !== 'Necessário:') {
        return {passwordNotValid: true}
      } else {
        return null
      }
    }
  }

}
