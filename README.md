<p align="center">
  <img width="150" height="100" src="https://github.com/Rocketseat/bootcamp-gostack-desafio-03/raw/master/.github/logo.png">
</p>   
 
 ## :open_file_folder: Sobre o desafio
Inicio do desenvolvimento do software Gympoint.

Aplicação feita em Express, além de algumas outras ferramentas:

* Sucrase + Nodemon;
* Sequelize (PostgreSQL);
* Funcionalidades
Abaixo estão descritas as funcionalidade também usadas.

### 1. Autenticação
Permitir que um usuário se autentique em sua aplicação utilizando e-mail e uma senha.

Usuário administrador criado a partir de seeds do sequelize. Essa funcionalidade serve para criarmos registros na base de dados de forma automatizada.

Exemplo de seed:

``yarn sequelize seed:generate --name admin-user``


`` const bcrypt = require("bcryptjs");``

``` module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      "users",
      [
        {
          name: "Administrador",
          email: "admin@gympoint.com",
          password_hash: bcrypt.hashSync("123456", 8),
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {}
    );
  },


  down: () => {}
}; 
```

Após isso é dado o comando:

``yarn sequelize db:seed:all``
ps: usuário usado para logins de teste dentro da plataforma.

* Autenticação feita utilizando **JWT**.
* Validação dos dados de entrada.

### 2. Cadastro de alunos
Alunos cadastrados utilizando nome, email, idade, peso e altura.

* O cadastro de alunos só pode ser feito por administradores autenticados na aplicação.

* O aluno não pode se autenticar no sistema, ou seja, não possui senha.


Funcionalidades do administrador

### 3. Gestão de planos

Usuário podem cadastrar planos de matrículas, tendo os planos os seguintes campos: 

* title ( nome do plano );
* duration ( duração em número de meses );
* price ( preço mensal do plano );
* created_at;
* updated_at;

Exemplos criados:

* `Start:` Plano de 1 mês por R$129; 

* `Gold:` Plano de 3 meses por R$109/mês; 

* `Diamond:` Plano de 6 meses por R$89/mês;  

Criação de rotas para `listagem/cadastro/atualização/remoção` de planos;

Obs.: Essa funcionalidade é para administradores autenticados na aplicação.


### 4. Gestão de matrículas
Apesar do aluno estar cadastrado na plataforma, isso não significa que o mesmo tem uma matrícula ativa e que pode acessar a academia.

Tabela de matrículas:

* `student_id` (referência ao aluno);  

* `plan_id` (referência ao plano);  

* `start_date` (data de início da matrícula);  

* `end_date` (date de término da matrícula);  

* `price` (preço total calculado na data da matrícula);  

* `created_at`;  

* `updated_at`;  

A **data de início** da matrícula deve ser escolhida pelo usuário.

A **data de término** e preço da matrícula deve ser calculada com base no plano selecionado, por exemplo:

Data de início informada: `23/05/2019` Plano selecionado: `Gold (3 meses)` Data de término calculada: `23/08/2019 (3 meses depois do início)` Preço calculado: `R$327`

Quando um aluno realiza uma matrícula ele recebe um e-mail com detalhes da sua inscrição na academia como plano, data de término, valor e uma mensagem de boas-vidas.

Crie rotas para listagem/cadastro/atualização/remocação de matrículas;

Obs.: Essa funcionalidade é para administradores autenticados na aplicação.


## :page_with_curl: Funcionalidades do aluno
Abaixo estão descritas as funcionalidades que você deve adicionar em sua aplicação para alunos.

### 5. Checkins
Quando o aluno chega na academia o mesmo realiza um check-in apenas informando seu `ID` de cadastro (ID do banco de dados);

Esse check-in serve para monitorar quantas vezes o usuário frequentou a academia na semana.

A tabela de checkins possui os campos:

* `student_id` (referência ao aluno);
* `created_at;`
* `updated_at;`
O usuário só pode fazer `5 checkins` dentro de um período de 7 dias corridos.

Exemplo de requisição: `POST https://gympoint.com/students/3/checkins`

Listagem de todos `checkins` realizados por um usuário com base em seu `ID` de cadastro;

Exemplo de requisição: `GET https://gympoint.com/students/3/checkins`

### 6. Pedidos de auxílio
O aluno pode criar pedidos de auxílio para a academia em relação a algum exercício, **alimentação** ou **instrução qualquer**;

A tabela `help_orders` contem os seguintes campos:

* `student_id` (referência ao aluno);
* `question` (pergunta do aluno em texto);
* `answer` (resposta da academia em texto);
* `answer_at` (data da resposta da academia);
* `created_at;`
* `updated_at;`

* Rota para a academia listar todos pedidos de auxílio sem resposta;

* Rota para o aluno cadastrar pedidos de auxílio apenas informando seu `ID` de cadastro (ID do banco de dados);

Exemplo de requisição: `POST https://gympoint.com/students/3/help-orders`

Rota para listar todos pedidos de auxílio de um usuário com base em seu `ID` de cadastro;

Exemplo de requisição: `GET https://gympoint.com/students/3/help-orders`

Rota para a academia responder um pedido de auxílio:

Exemplo de requisição: `POST https://gympoint.com/help-orders/1/answer`

Quando um pedido de auxílio for respondido, o aluno deve receber um e-mail da plataforma com a pergunta e resposta da academia;

### 📝 Licença
Esse projeto está sob a licença **MIT**.
