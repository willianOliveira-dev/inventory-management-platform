# Frontend da Plataforma de Gestão de Estoque

Este é o frontend da aplicação de gestão de estoque, uma interface de usuário completa e responsiva que interage com a **API de Gestão de Estoque**. O projeto foi construído utilizando **React** com **TypeScript**, **Vite** e **Tailwind CSS**.

----

### Tecnologias e Dependências

O projeto utiliza um conjunto moderno de tecnologias para garantir eficiência, performance e facilidade de manutenção.

  - **React**: Biblioteca para a construção da interface do usuário.
  - **TypeScript**: Adiciona tipagem estática, aumentando a segurança e a clareza do código.
  - **Vite**: Ferramenta de build rápida para desenvolvimento e otimização para produção.
  - **Tailwind CSS**: Framework de CSS para design rápido e consistente.
  - **React Router DOM**: Gerencia a navegação e o roteamento da aplicação.
  - **Axios**: Cliente HTTP para comunicação com a API.
  - **Recharts**: Biblioteca para renderização de gráficos, utilizada para os relatórios.
  - **AOS (Animate On Scroll)**: Biblioteca para animações de elementos ao rolar a página.

-----

### Visão Geral da Arquitetura

O frontend é uma **Single Page Application (SPA)**, o que significa que todas as interações e navegações acontecem em uma única página HTML, sem a necessidade de recarregar a tela. Isso proporciona uma experiência de usuário mais fluida e rápida.

A arquitetura do frontend é modular e organizada, facilitando o desenvolvimento e a escalabilidade. O **coração da aplicação** reside na combinação do `AuthProvider` com os interceptores do Axios, que juntos gerenciam todo o fluxo de autenticação e comunicação com a API, de forma transparente para o usuário e segura.

  - **`src/api`**: Contém toda a lógica de comunicação com a API, incluindo o tratamento de autenticação e a renovação automática de tokens.
  - **`src/components`**: Componentes reutilizáveis da interface de usuário, como botões, modais, cabeçalho e barra lateral.
  - **`src/contexts`**: Gerenciamento de estado global da aplicação (autenticação, produtos, categorias) usando a React Context API.
  - **`src/pages`**: Componentes que representam as telas da aplicação (ex: Login, Dashboard, Produtos).
  - **`src/router`**: Define todas as rotas da aplicação, incluindo rotas públicas e privadas.
  - **`src/utils`**: Funções utilitárias e ajudantes, como formatação de dados e armazenamento de tokens.

-----

### Fluxo de Autenticação e Navegação

O sistema de autenticação é robusto, utilizando um fluxo de tokens JWT para garantir a segurança.

  - **`App.tsx`**: O ponto de entrada da aplicação. Inicializa o `AOS` e envolve todas as rotas com o `AuthProvider`, garantindo que o estado de autenticação esteja disponível globalmente.
  - **`AuthProvider`**: Este provedor de contexto gerencia o ciclo de vida da autenticação. Ele verifica se o usuário está logado, armazena os dados do usuário e fornece as funções de `login`, `register` e `logout` para o resto da aplicação.
  - **`api.ts`**: Configura o **Axios** para interagir com a API. Ele adiciona um **interceptor de requisição** que anexa o `accessToken` a cada chamada. Mais importante, o **interceptor de resposta** lida com a renovação automática de tokens, garantindo que o usuário permaneça logado mesmo quando o `accessToken` expira.
  - **`router.tsx`**: Define a navegação. Rotas como `/` e `/products` são protegidas pelo componente `<ProtectedRoute>`, que redireciona o usuário para a página de login caso ele não esteja autenticado.

-----

### Rotas da Aplicação

  - `/`
      - Página principal (Home) e rotas filhas do dashboard. **(Requer autenticação)**
      - `/products`: Lista de produtos.
      - `/products/new`: Formulário para adicionar um novo produto.
      - `/products/:itemId`: Detalhes de um produto específico.
      - `/products/:itemId/edit`: Formulário para editar um produto.
      - `/categories`: Lista de categorias.
      - `/categories/new`: Formulário para adicionar uma nova categoria.
      - `/categories/:categoryId/edit`: Formulário para editar uma categoria.
      - `/reports`: Relatórios e análises.
  - `/login`
      - Página de login. **(Acesso público)**
  - `/register`
      - Página de registro de novos usuários. **(Acesso público)**

-----

### Como Executar o Projeto

Siga estes passos para configurar e rodar o frontend localmente.

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/willianOliveira-dev/inventory-management-platform.git
    cd inventory-management-platform/frontend
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    O aplicativo estará disponível em `http://localhost:5173/`. Certifique-se de que o backend esteja em execução na porta `5000` para que o frontend possa se conectar corretamente.