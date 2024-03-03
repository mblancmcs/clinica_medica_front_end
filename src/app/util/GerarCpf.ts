export class GerarCpf {

  cpfNumber: Array<number> = [];
  notAcepted: Array<string> = [
      "00000000000", "11111111111", "22222222222", "33333333333", "44444444444",
      "55555555555", "66666666666", "77777777777", "88888888888", "99999999999"
  ];

  static generate(): string {
      let number = [];
      for (let i = 0; i < 9; i++) {
          number.push(Math.floor(Math.random() * 10));
      }
      number.push(this.calculateFirstDigit(number));
      number.push(this.calculateSecondDigit(number));
      return number.join('');
  }
  static calculateFirstDigit(values: Array<number>): number {
      let sum = 0;
      for (let i = 0; i < 9; i++) {
          sum += values[i] * (10 - i);
      }
      let rest = (sum * 10) % 11;
      if (rest === 10 || rest === 11) {
          rest = 0;
      }
      return rest;
  }
  static calculateSecondDigit(values: Array<number>): number {
      let sum = 0;
      for (let i = 0; i < 10; i++) {
          sum += values[i] * (11 - i);
      }
      let rest = (sum * 10) % 11;
      if (rest === 10 || rest === 11) {
          rest = 0;
      }
      return rest;
  }

}
