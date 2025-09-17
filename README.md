# Plataforma de Gestão de Estoque

Uma solução completa para gerenciamento de estoque, permitindo o cadastro de produtos, categorias e usuários, além de rastrear o histórico de estoque e gerar relatórios. O projeto é composto por um backend robusto e um frontend interativo.

-----

### Arquitetura do Projeto

O projeto adota uma arquitetura monolítica, dividida em duas partes principais:

  * **Backend**: Construído com **Node.js**, **Express**, e **MySQL**. Responsável por toda a lógica de negócio, persistência de dados e segurança, incluindo um sistema de autenticação com JWT e renovação de tokens.

  * **Frontend**: Desenvolvido em **React** com **TypeScript** e **Vite**. Esta é uma **Single Page Application (SPA)**, que oferece uma experiência de usuário fluida e rápida, comunicando-se com o backend através de uma API RESTful.

O **coração da aplicação** reside na sinergia entre o **`AuthProvider`** no frontend e os **interceptores do Axios** no backend. Juntos, eles gerenciam de forma transparente o fluxo de autenticação, renovando automaticamente os tokens de acesso sem a necessidade de o usuário fazer login novamente.

-----

###  Recursos Principais

  - **Autenticação Segura**: Sistema de login e registro com JWT.
  - **Gestão de Itens**: Adicione, edite, remova e visualize produtos.
  - **Gestão de Categorias**: Organize os produtos por categorias.
  - **Histórico de Estoque**: Acompanhe todas as entradas e saídas de produtos.
  - **Relatórios e Análises**: Acesse relatórios detalhados para tomar decisões estratégicas.

-----

### Como Executar o Projeto

Siga as instruções abaixo para configurar e rodar a plataforma completa localmente.

#### Pré-requisitos

  * [Node.js](https://nodejs.org/) (versão 18 ou superior)
  * [Git](https://git-scm.com/)
  * [MySQL](https://www.mysql.com/)

#### 1\. Configurar o Backend

1.  Navegue até o diretório do backend:
    ```bash
    cd backend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Crie um arquivo `.env` na raiz do backend e configure as variáveis de ambiente, incluindo a conexão com o banco de dados.
4.  Execute o script SQL para criar o banco de dados e as tabelas. O arquivo `init.sql` está localizado em `database/init.sql`.
    ```bash
    mysql -u seu_usuario -p < database/init.sql
    ```
5.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
    O backend estará rodando em `http://localhost:5000/`.

#### 2\. Configurar o Frontend

1.  Abra um novo terminal e navegue até o diretório do frontend:
    ```bash
    cd frontend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento do frontend:
    ```bash
    npm run dev
    ```
    O frontend estará disponível em `http://localhost:5173/`.

Com ambos os servidores em execução, sua plataforma de gestão de estoque estará pronta para ser usada\!

-----

### Documentação Detalhada

Para mais informações sobre a arquitetura e funcionalidades específicas de cada parte, acesse as documentações dedicadas:

  * [Documentação do Backend](https://github.com/willianOliveira-dev/inventory-management-platform/tree/main/backend)
  * [Documentação do Frontend](https://github.com/willianOliveira-dev/inventory-management-platform/tree/main/frontend)
