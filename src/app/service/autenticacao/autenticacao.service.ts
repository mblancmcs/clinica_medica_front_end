import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { GetUsuarios, Usuario } from '../../models/usuario-interface';
import { Router } from '@angular/router';
import { Token } from '../../models/token-interface';
import { JwtService } from './jwt.service';
import { Autenticacao } from '../../models/autenticacao-interfaces';

@Injectable({
  providedIn: 'root',
})
export class AutenticacaoService {

  private readonly api = 'http://localhost:8080/auth';
  private loggedIn: Subject<boolean> = new Subject<boolean>();
  public loggedInUserSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
  loggedInUserId= this.loggedInUserSubject.asObservable();
  authPath:string[] = [];

  constructor(private http: HttpClient, private router: Router, private jwtService: JwtService) { }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  login(login:Autenticacao): Promise<void> | void {
    this.http.post<Token>(`${this.api}/login`, login).subscribe({
      next: (response) => {
        const token = response.token;
        const role = this.jwtService.getClaim(token, 'role');
        const id = this.jwtService.getClaim(token, 'id');
        this.loggedIn.next(true);
        this.loggedInUserSubject.next(login.login);
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('id', id);
        if(role === 'ATENDENTE') {
          this.authPath = ['consulta', 'paciente'];
          localStorage.setItem('authPath', this.authPath.toString());
          this.router.navigate(['/consulta']);
        } else if(role === 'MEDICO') {
          this.authPath = ['atendimento', 'historicoAtendimentos'];
          localStorage.setItem('authPath', this.authPath.toString());
          this.router.navigate(['/atendimento']);
        } else if(role === 'ADMIN') {
          this.authPath = ['admin', 'consulta', 'paciente', 'atendimento', 'historicoAtendimentos'];
          localStorage.setItem('authPath', this.authPath.toString());
          this.router.navigate(['/admin']);
        }
      },
      error: (error) => {
        console.log(error);
        this.loggedIn.next(false);
        this.router.navigate(['/home']);
      }
    });
  }

  listar(pagina?:number): Observable<GetUsuarios> {
    let params = new HttpParams();
    if(pagina) {
      params = params.append('page', pagina);
    }
    return this.http.get<GetUsuarios>(`${this.api}/listar`, {params});
  }

  registrar(usuario:Usuario):Observable<Usuario> {
    return this.http.post<Usuario>(`${this.api}/registrar`, usuario);
  }

  atualizar(usuario:Usuario):Observable<Usuario> {
    return this.http.put<Usuario>(`${this.api}/atualizar`, usuario);
  }

  deletar(usuario:Usuario):Observable<any> {
    return this.http.delete(`${this.api}/login=${usuario.login}`)
  }

  logout() {
    this.loggedIn.next(false);
    //localStorage.removeItem('token');
    localStorage.clear();
    this.router.navigate(['/home']);
  }

  protecaoPaginas() {
    let authPath = localStorage.getItem('authPath')?.split(',') as string[];
    if(!authPath.includes(this.router.url.replace('/', ''))) {
      this.router.navigate(['/home']);
    }
  }

}
