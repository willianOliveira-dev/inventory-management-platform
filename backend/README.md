## Documentação da API de Gestão de Estoque

Esta documentação fornece um guia abrangente para utilizar a API de Gestão de Estoque, cobrindo a arquitetura, autenticação e endpoints disponíveis.

### 1\. Visão Geral

A API foi desenvolvida para suportar um sistema de gerenciamento de estoque, permitindo operações como cadastro de usuários, gestão de categorias, itens e acompanhamento do histórico de estoque. A arquitetura é baseada em **Node.js** com **TypeScript** e **Express**, utilizando **MySQL** como banco de dados.

### 2\. Autenticação e Autorização

A API utiliza um sistema de **autenticação com JWT** (JSON Web Tokens), incluindo um **par de tokens**: um **AccessToken** de curta duração e um **RefreshToken** de longa duração.

  - **AccessToken**: Usado para autenticar requisições na maioria dos endpoints. Expira em 15 minutos para maior segurança.
  - **RefreshToken**: Usado exclusivamente para obter um novo `accessToken` sem que o usuário precise fazer login novamente. É armazenado em um **cookie seguro, HttpOnly** e validado contra um hash no banco de dados.

O fluxo de autenticação é o seguinte:

1.  O usuário faz login com `email` e `password`.
2.  A API retorna o `accessToken` e envia o `refreshToken` em um cookie.
3.  O `accessToken` é usado no header `Authorization` de cada requisição.
4.  Quando o `accessToken` expira, o cliente faz uma requisição ao endpoint de `refresh` para obter um novo par de tokens.

**Padrão de Resposta**
As respostas da API, exceto em casos de validação Zod, seguem o padrão:

```json
{
    "status": "success" | "error",
    "code": "CÓDIGO_DA_RESPOSTA",
    "statusCode": 200 | 201 | 400 | 401 | 403 | 404 | 422 | 500,
    "message": "Mensagem descritiva da resposta",
    "data": "Dados retornados (opcional)"
}
```

-----

### 3\. Diagrama de Entidade e Relacionamentos (DER)

Este diagrama representa a estrutura do banco de dados e as relações entre as tabelas.

  - **users**: Contém informações do usuário. `user_id` é a chave primária.
  - **categories**: Armazena categorias criadas pelos usuários. Possui uma relação de **muitos para um** com `users` (uma categoria pertence a um único usuário). `user_id` é uma chave estrangeira.
  - **items**: Armazena os itens de estoque. Possui uma relação de **muitos para um** com `users` e `categories`. `user_id` e `category_id` são chaves estrangeiras.
  - **refresh\_tokens**: Armazena os tokens de atualização para segurança. Relaciona-se com `users`.
  - **stock\_history**: Registra todas as operações de estoque (adição, atualização). Relaciona-se com `users` e `items`.

-----

### 4\. Endpoints da API

#### **Autenticação (Auth)**

  - **`POST /panel/v1/auth/register`**
      - **Descrição**: Cria um novo usuário e o autentica, retornando um `accessToken`.
      - **Validação**: Zod (`AuthSchema` para login, `UserSchema` para registro)
      - **Corpo da Requisição**:
        ```json
        {
          "name": "string",
          "email": "string",
          "password": "string"
        }
        ```
      - **Resposta de Sucesso**: `HTTP 201 Created`
  - **`POST /panel/v1/auth/login`**
      - **Descrição**: Autentica um usuário existente, retornando um `accessToken`. O `refreshToken` é enviado via cookie.
      - **Validação**: Zod (`AuthSchema`)
      - **Corpo da Requisição**:
        ```json
        {
          "email": "string",
          "password": "string"
        }
        ```
      - **Resposta de Sucesso**: `HTTP 200 OK`
  - **`POST /panel/v1/auth/logout`**
      - **Descrição**: Invalida o `refreshToken` do usuário, encerrando a sessão.
      - **Resposta de Sucesso**: `HTTP 200 OK`
  - **`POST /panel/v1/auth/refresh`**
      - **Descrição**: Gera um novo `accessToken` e `refreshToken` a partir de um `refreshToken` válido.
      - **Resposta de Sucesso**: `HTTP 200 OK`
  - **`GET /panel/v1/auth/me`**
      - **Descrição**: Retorna os dados do usuário autenticado a partir do `accessToken`.
      - **Autorização**: Requer `accessToken` válido no header `Authorization`.
      - **Resposta de Sucesso**: `HTTP 200 OK`

-----

#### **Usuários (Users)**

  - **`GET /panel/v1/users`**
      - **Descrição**: Retorna a lista de todos os usuários.
      - **Autorização**: Requer `accessToken` válido.
  - **`GET /panel/v1/users/:id`**
      - **Descrição**: Retorna os dados de um usuário específico pelo `id`.
      - **Autorização**: Requer `accessToken` válido.
  - **`POST /panel/v1/users`**
      - **Descrição**: Cria um novo usuário (útil para administradores).
      - **Autorização**: Requer `accessToken` válido.
      - **Corpo da Requisição**: `UserSchema`
  - **`PATCH /panel/v1/users/:id`**
      - **Descrição**: Atualiza os dados de um usuário.
      - **Autorização**: Requer `accessToken` válido.
      - **Corpo da Requisição**: `UserUpdateSchema`
  - **`DELETE /panel/v1/users/:id`**
      - **Descrição**: Exclui um usuário.
      - **Autorização**: Requer `accessToken` válido.

-----

#### **Categorias (Categories)**

  - **`GET /panel/v1/categories`**
      - **Descrição**: Retorna todas as categorias existentes.
      - **Autorização**: Requer `accessToken` válido.
  - **`GET /panel/v1/categories/:id`**
      - **Descrição**: Retorna uma categoria específica pelo `id`.
      - **Autorização**: Requer `accessToken` válido.
  - **`GET /panel/v1/categories/user/my-categories`**
      - **Descrição**: Retorna todas as categorias criadas pelo usuário autenticado.
      - **Autorização**: Requer `accessToken` válido.
  - **`POST /panel/v1/categories`**
      - **Descrição**: Cria uma nova categoria.
      - **Autorização**: Requer `accessToken` válido.
      - **Corpo da Requisição**: `CategorySchema`
  - **`PATCH /panel/v1/categories/:id`**
      - **Descrição**: Atualiza uma categoria.
      - **Autorização**: Requer `accessToken` válido.
      - **Corpo da Requisição**: `CategorySchema`
  - **`DELETE /panel/v1/categories/:id`**
      - **Descrição**: Exclui uma categoria.
      - **Autorização**: Requer `accessToken` válido.

-----

#### **Itens (Items)**

  - **`GET /panel/v1/items`**
      - **Descrição**: Retorna todos os itens do sistema.
      - **Autorização**: Requer `accessToken` válido.
  - **`GET /panel/v1/items/:id`**
      - **Descrição**: Retorna um item específico pelo `id`.
      - **Autorização**: Requer `accessToken` válido.
  - **`GET /panel/v1/items/user/my-items`**
      - **Descrição**: Retorna todos os itens criados pelo usuário autenticado.
      - **Autorização**: Requer `accessToken` válido.
  - **`POST /panel/v1/items`**
      - **Descrição**: Cria um novo item e registra o histórico de estoque inicial.
      - **Autorização**: Requer `accessToken` válido.
      - **Corpo da Requisição**: `ItemSchema`
  - **`PATCH /panel/v1/items/:id`**
      - **Descrição**: Atualiza um item e registra a alteração no histórico de estoque.
      - **Autorização**: Requer `accessToken` válido.
      - **Corpo da Requisição**: `ItemUpdateSchema`
  - **`DELETE /panel/v1/items/:id`**
      - **Descrição**: Exclui um item.
      - **Autorização**: Requer `accessToken` válido.

-----

### 5\. Configuração e Dependências

#### Para rodar o projeto, siga estes passos:

1. **Execute o comando git clone** seguido do link do repositório:

```bash
git clone https://github.com/willianOliveira-dev/inventory-management-platform.git
 ```

> Após a execução do comando, uma nova pasta chamada `inventory-management-platform` será criada no diretório atual, contendo todos os arquivos do projeto.

2.  **Instale as dependências** do `package.json`.
    ```bash
    npm install
    ```
3.  **Crie um arquivo `.env`** na raiz do projeto e configure as variáveis de ambiente necessárias, incluindo as chaves JWT e as credenciais do banco de dados MySQL.
   
4.  **Inicie o servidor** em modo de desenvolvimento ou produção.
      - **Desenvolvimento**: `npm run dev` (com `ts-node-dev`, recarrega automaticamente)
      - **Produção**: `npm run start` (roda o código compilado em `dist/`)

**Pacotes Chave:**

  - **`express`**: Framework web.
  - **`typescript`**: Adiciona tipagem estática.
  - **`mysql2`**: Driver para conexão com o MySQL.
  - **`jsonwebtoken`**: Para manipulação dos JWT.
  - **`bcrypt`**: Para hash de senhas e tokens.
  - **`zod`**: Para validação de dados da requisição.
  - **`helmet`**: Segurança (cabeçalhos HTTP).
  - **`cors`**: Permite requisições de outras origens.
  - **`dotenv`**: Carrega variáveis de ambiente.


-----

### 6\. Diagrama de Entidade e Relacionamentos (DER)

Este diagrama representa a estrutura do banco de dados e as relações entre as tabelas.

  - **users**: Contém informações do usuário. `user_id` é a chave primária.
  - **categories**: Armazena categorias criadas pelos usuários. Possui uma relação de **muitos para um** com `users` (uma categoria pertence a um único usuário). `user_id` é uma chave estrangeira.
  - **items**: Armazena os itens de estoque. Possui uma relação de **muitos para um** com `users` e `categories`. `user_id` e `category_id` são chaves estrangeiras.
  - **refresh\_tokens**: Armazena os tokens de atualização para segurança. Relaciona-se com `users`.
  - **stock\_history**: Registra todas as operações de estoque (adição, atualização). Relaciona-se com `users` e `items`.


```mermaid
erDiagram
    users {
        CHAR(36) user_id PK
        VARCHAR(50) name
        VARCHAR(150) email UN
        VARCHAR(250) password
        DATETIME created_at
        DATETIME updated_at
    }
    categories {
        CHAR(36) category_id PK
        CHAR(36) user_id FK
        VARCHAR(120) name UN
        DATETIME created_at
        DATETIME updated_at
    }
    items {
        CHAR(36) item_id PK
        CHAR(36) user_id FK
        CHAR(36) category_id FK
        VARCHAR(120) name
        INT price_cents
        VARCHAR(500) description
        INT current_quantity
        DATETIME created_at
        DATETIME updated_at
    }
    stock_history {
        CHAR(36) history_id PK
        CHAR(36) item_id FK
        CHAR(36) user_id FK
        INT old_price_cents
        INT new_price_cents
        INT old_quantity
        INT new_quantity
        VARCHAR(10) operation
        DATETIME created_at
    }
    refresh_tokens {
        CHAR(36) token_id PK
        CHAR(36) user_id FK
        VARCHAR(255) token UN
        BOOLEAN revoked
        CHAR(36) replaced_by
        DATETIME created_at
        DATETIME expires_at
        DATETIME revoked_at
    }
    users ||--o{ categories : "creates"
    users ||--o{ items : "owns"
    users ||--o{ stock_history : "tracks changes"
    users ||--o{ refresh_tokens : "has"
    categories ||--o{ items : "contains"
    items ||--o{ stock_history : "has history"
```

-----

### 7\. Usando o `init.sql`

O arquivo `init.sql` na pasta `database/init.sql` foi criado para facilitar a inicialização do banco de dados. Ele contém todos os comandos `CREATE TABLE` necessários para configurar a estrutura de tabelas da sua API.

**Como usar:**

1.  Certifique-se de que o MySQL esteja instalado e em execução no seu sistema.
2.  Abra um terminal ou cliente de linha de comando para o MySQL (como o `mysql` shell).
3.  Faça login no MySQL como um usuário com permissões para criar bancos de dados.
    ```bash
    mysql -u seu_usuario -p
    ```
4.  Execute os comandos do arquivo `init.sql` para criar o banco de dados e todas as tabelas. Você pode fazer isso de duas maneiras:
      - **Copiando e colando o conteúdo:** Abra o arquivo, copie todo o código e cole no seu terminal MySQL.
      - **Executando diretamente do arquivo:** Aponte o MySQL para o arquivo usando o comando `source`.
        ```bash
        mysql -u seu_usuario -p < caminho/para/seu/projeto/database/init.sql
        ```

Após a execução, o banco de dados `control_panel_db` estará pronto para ser utilizado pela sua API. Isso evita a necessidade de criar as tabelas manualmente e garante que a estrutura de dados esteja correta.