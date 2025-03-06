# Desafio Back-End com PostgreSQL

Este projeto é uma aplicação back-end desenvolvida para o desafio proposto, utilizando Node.js e PostgreSQL.

## Tecnologias Utilizadas

- Node.js
- Express
- Sequelize
- PostgreSQL

## Requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/)

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/Louiis04/Desafio-back-end-postgres-.git
   cd Desafio-back-end-postgres-
   ```
   
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o banco de dados:

Crie um banco de dados PostgreSQL.

4. Execute as migrações do Sequelize para criar as tabelas no banco de dados:
   ```bash
   npx sequelize-cli db:migrate
   ```
   Se caso quiser pode popular o banco:
   ```bash
   npx sequelize-cli db:seed:all
   ```

  ## Uso
Para iniciar o servidor, execute:
   ```bash
   node app.js
   ```
O servidor estará disponível em http://localhost:3000.

## Estrutura do Projeto

- **`config/`** – Configurações do banco de dados e do Sequelize.
- **`migrations/`** – Arquivos de migração do Sequelize.
- **`models/`** – Definições dos modelos do Sequelize.
- **`routes/`** – Definições das rotas da aplicação.
- **`seeders/`** – Arquivos para popular o banco de dados com dados iniciais.
- **`src/`** – Código-fonte principal da aplicação.
- **`README.md`** – Documentação do projeto.


## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.


   
