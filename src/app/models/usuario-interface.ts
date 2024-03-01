export interface Usuario {
  id?:number;
  login:string;
  password?:string;
  role:string;
}

export interface GetUsuarios {
  content: Usuario[];
  totalElements:number;
  totalPages:number;
}

export class GetModeloUsuarios implements GetUsuarios {

  content = [];
  totalElements = 0;
  totalPages = 0;

}
