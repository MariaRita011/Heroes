# API de Heróis

## Introdução

Este é um projeto simples de API em Node.js utilizando o framework Express e o banco de dados PostgreSQL. A API gerencia informações de heróis e calcula batalhas entre eles.

## Funcionalidades

A API possui as seguintes funcionalidades para heróis:

* Listar todos os heróis cadastrados
* Adicionar um novo herói
* Atualizar um herói existente
* Excluir um herói
* Buscar um herói pelo seu ID
* Buscar um herói pelo seu nome (busca com filtro)

Além disso, a API possui funcionalidades para as batalhas:

* Listar todas as batalhas cadastradas;
* Listar todas as batalhas cadastradas (com ids do herói 1, herói 2, id do ganhador e nome do ganhador).

## Tecnologias Utilizadas

* Node.js
* Express
* PostgreSQL

## Instalações

### 1. Clonar o repositório

```bash
[git clone https://github.com/MariaRita011/HarryPotter.git](https://github.com/MariaRita011/Heroes.git)
```

### 2. Instalar as dependências

```terminal
npm install
```

### 3. Configure as variáveis de ambiente

```javascript
  user: "nomedeusuario",
  host: "localdoservidor",
  database: "nomedodatabase",
  password: "senhadobanco",
  port: "portadoservidor",
  
```

## Como usar
### 1. Iniciar o servidor

```terminal
npm run dev
```

Faça as requisições via Insomnia ou pelo próprio banco de dados e aproveite! :)
