# Clínica médica

Front-end desenvolvido em Angular 17, do meu projeto pessoal (API Rest) de uma clínica médica, desenvolvido em Java, Spring Boot, Hibernate como implementação do Spring Data JPA e Spring Security para controle de acesso de usuários.

## Stack
- TypeScript: superset da linguagem JavaScript e utilizada por padrão com o framework Angular.
- Angular 17: versão mais recente do framework, lançada em novembro de 2023 e suporte até maio de 2025.
- Angular Material: biblioteca de componentes do framework, utilizada principalmente para os dialogs.
- Bootstrap: framework css, utilizado principalmente para responsividade da navbar.

## Execução

- Necessário clonar o repositório do meu projeto pessoal (API Rest) de clínica médica no GitHub, e seguir o que é informado sobre como executá-la.
- Após clonar esse repositório destinado ao front-end da aplicação, executar em ambiente local o comando:
```bash
ng serve
```
- Ao executar, a aplicação poderá ser visualizada em ambiente local pelo navegador, através do endereço: "http://localhost:4200".
- É possível analisar a aplicação hospedada na AWS, pelo endereço: http://clinica-medica-app.s3-website-sa-east-1.amazonaws.com/

Observações:
- Não há certificado SSL, logo por mais que no link esteja com "http" no início, o navegador forçará o acesso por "https", logo é necessário alterar para "http" para acessar a aplicação hospedada.
- 20 minutos após o último login, o banco de dados é reiniciado para o estado inicial.


## Funcionamento

### Marcação de consulta

#### O que é preciso informar:
- nome do paciente;
- informação do plano de saúde ou se é particular;

#### Se for antecipada:
- necessário informar o dia e horário da consulta;

OBS: o atendente liga para confirmar a consulta com o paciente, um dia antes do atendimento. Caso o mesmo cancele, não há ônus para ele.

#### Por ordem de chegada:
- Se tiver horário disponível, é entregue uma senha para aguardar o atendimento.

OBS: só será chamado caso não haja conflito de horário com algum paciente agendado.

### Atendente

Os pacientes são chamados pela ordem das senhas ou horário previamente agendado.

Caso o paciente não tenha ficha na clínica, é criado uma para ele com os seus dados básicos: CPF, nome, data de nascimento, endereço e telefones.

Com a ficha do paciente em mãos, é registrado o motivo da consulta numa ficha de atendimento, anexada à ficha do paciente, e colocada embaixo da pilha de fichas de atendimento (para os atendimentos serem realizados por ordem de chegada).

É informado ao paciente aguardar para ser chamado e finaliza o atendimento.

### Atendimento médico

Realizado de acordo com a ordem da pilha de fichas de atendimento (ordenadas por ordem de chegada).

#### Antes de chamar o médico analisa:
- o histórico de atendimentos do paciente;
- o motivo da consulta atual;

#### Após o atendimento, o médico descreve detalhes do atendimento na ficha de atendimento, como:
- diagnóstico;
- receita de remédios;
- solicitação de retorno;
- complemento (outras informações).

### Autenticação e autorização
Usuário: admin

Senha: 123456

- Ao acessar com o usuário administrador, é possível listar os usuários cadastrados ou cadastrar novos com os seguintes acessos: "ATENDENTE", "MEDICO" ou "ADMIN".
- O atendente terá acesso a todos métodos dos controllers de consultas e pacientes.
- O médico terá acesso apenas aos atendimentos, que virão com informações da referente consulta e do paciente.
- O administrador / ADMIN terá acesso total ao sistema.

### Telas e responsividade

#### Tela de login
![tela_login](https://github.com/mblancmcs/clinica_medica_front_end/assets/77879631/1dc0a59c-7cf1-4326-947d-25f5aecda2ff)

#### Tela de consultas
![tela_consultas](https://github.com/mblancmcs/clinica_medica_front_end/assets/77879631/da306550-23af-41cd-8346-c267c3ee6623)

#### Tela de pacientes
![tela_pacientes](https://github.com/mblancmcs/clinica_medica_front_end/assets/77879631/df338eb4-a9fb-4351-b1e8-e94673b8ec5c)

#### Tela de atendimento médico
![tela_atendimento_medico2](https://github.com/mblancmcs/clinica_medica_front_end/assets/77879631/738c3d53-5cc0-47ca-992b-9d5b8df2715c)

#### Tela de histórico de atendimentos
![tela_historico_atendimento](https://github.com/mblancmcs/clinica_medica_front_end/assets/77879631/a4c75881-6d7f-4bbe-8b5d-c9fa2b7a53da)

#### Tela do painel administrativo
![tela_painel_administrativo](https://github.com/mblancmcs/clinica_medica_front_end/assets/77879631/3285b458-058a-415d-8ac5-66c2bf033bc7)

#### Responsividade de telas
![4-telas-principais-responsivas-juntas](https://github.com/mblancmcs/clinica_medica_front_end/assets/77879631/6bc1d3df-babd-43bd-8741-3e5f35bb72bf)

### Exemplo do modal de atualização e exclusão

![modal_atualizacao_exclusao](https://github.com/mblancmcs/clinica_medica_front_end/assets/77879631/cdce938d-f698-4de4-b4a8-e81bc8b1cf85)

### Modais de atualização, confirmação e exclusão realizadas com sucesso

#### Modal de atualização realizada
![modal_confirmacao_atualizacao](https://github.com/mblancmcs/clinica_medica_front_end/assets/77879631/87550106-a1a2-4e72-98f7-30f99197ebe0)

#### Modal de confirmação de exclusão
![modal_confirmacao_exclusao](https://github.com/mblancmcs/clinica_medica_front_end/assets/77879631/becde086-ebd4-4e44-b3a9-b2d320c2e3f0)

#### Modal de exclusão realizada
![modal_exclusao_confirmada](https://github.com/mblancmcs/clinica_medica_front_end/assets/77879631/43f1de28-6f37-4334-a43d-be7aa4d22191)

### Modais de confirmação (alerta) e erro

#### Modal de alerta para confirmação de "encaixe"
![modal_encaixe](https://github.com/mblancmcs/clinica_medica_front_end/assets/77879631/9e52f7e2-c5c2-4cd3-8492-1d388c9f1512)

#### Modal de erro
![modal_erro](https://github.com/mblancmcs/clinica_medica_front_end/assets/77879631/ce67bc5b-8238-4991-b27d-9f3331e71692)

## Atualizações da aplicação

V.1 - Versão inicial.

## Contribuições

Pull requests são bem vindos. Para maiores alterações, por favor crie uma publicação para que seja discutido sobre.

Por favor faça o upload dos testes apropriados.

## Licença

[MIT](https://choosealicense.com/licenses/mit/)
