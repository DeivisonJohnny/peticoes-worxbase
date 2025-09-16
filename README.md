# Worxbase - Gerador de Petições Jurídicas ⚖️

Este é o repositório do front-end para a aplicação de geração de documentos de uma associação de advogados. O projeto visa digitalizar e automatizar a criação de petições e outros documentos jurídicos que antes eram feitos manualmente, agilizando o trabalho e aumentando a precisão.

---

## 📋 Índice

- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Como Executar o Projeto](#-como-executar-o-projeto)
- [Padrão de Commits](#-padrão-de-commits)
- [Fluxo de Desenvolvimento](#-fluxo-de-desenvolvimento)

---

## ✨ Tecnologias Utilizadas

Este projeto foi construído com um conjunto moderno de tecnologias para garantir uma experiência de desenvolvimento e de usuário eficientes e robustas.

- **Framework Principal**:

  - **[Next.js](https://nextjs.org/)**: Framework React para renderização no servidor e geração de sites estáticos.
  - **[React](https://react.dev/)**: Biblioteca para criar interfaces de usuário.
  - **[TypeScript](https://www.typescriptlang.org/)**: Superset do JavaScript que adiciona tipagem estática.

- **Estilização e UI**:

  - **[Tailwind CSS](https://tailwindcss.com/)**: Framework de CSS utility-first para estilização rápida.
  - **[shadcn/ui](https://ui.shadcn.com/)**: Coleção de componentes de UI reutilizáveis.

- **Gerenciamento de Formulários e Validação**:

  - **[React Hook Form](https://react-hook-form.com/)**: Biblioteca para gerenciamento de formulários complexos.
  - **[yup](https://github.com/jquense/yup)**: Biblioteca para validação de esquemas e tipos.

- **Requisições HTTP**:
  - **[Axios](https://axios-http.com/)**: Cliente HTTP baseado em Promises para navegador e Node.js.

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para rodar a aplicação em seu ambiente local.

### Pré-requisitos

- **Node.js** (versão 18.x ou superior)
- Um gerenciador de pacotes como **npm**, **Yarn** ou **pnpm**

### Instalação e Execução

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/Worxbase/peticoes-frontend.git
    ```

2.  **Acesse a pasta do projeto:**

    ```bash
    cd peticoes-frontend
    ```

3.  **Instale as dependências:**

    ```bash
    npm install
    # ou
    yarn install
    ```

4.  **Inicie o servidor de desenvolvimento:**

    ```bash
    npm run dev
    # ou
    yarn dev
    ```

5.  **Abra no navegador:**
    Acesse [http://localhost:3000](http://localhost:3000) em seu navegador para ver a aplicação funcionando.

---

## ✔️ Padrão de Commits

Para manter um histórico de commits claro, legível e rastreável, este projeto utiliza o padrão **[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)**.

A estrutura de um commit deve ser a seguinte:

```
<tipo>(escopo opcional): <descrição>
```

**Tipos mais comuns:**

- **feat**: Uma nova funcionalidade (feature).
- **fix**: Uma correção de bug.
- **docs**: Alterações na documentação.
- **style**: Alterações de formatação de código (espaços, ponto e vírgula, etc.) que não afetam a lógica.
- **refactor**: Refatoração de código que não corrige um bug nem adiciona uma funcionalidade.
- **test**: Adição ou modificação de testes.
- **chore**: Atualizações de tarefas de build, gerenciador de pacotes, dependências, etc.

**Exemplos:**

```bash
git commit -m "feat(auth): implementar tela de login com e-mail e senha"
```

```bash
git commit -m "fix(form): corrigir validação do campo de CPF"
```

```bash
git commit -m "docs: atualizar o README com o padrão de commits"
```

---

## 💻 Fluxo de Desenvolvimento

> **Atenção:** Para fins de clareza nesta documentação, os exemplos de branches e commits estão em português, mas no desenvolvimento real do projeto, **utilize o idioma inglês**.

Para manter a organização e a qualidade do código, siga os passos abaixo ao desenvolver uma nova funcionalidade ou corrigir um bug:

1.  A partir da branch `main`, crie uma nova branch para sua tarefa. Siga o padrão `tipo/nome-da-tarefa-ou-pagina`.

    ```bash
    # Exemplo para uma nova funcionalidade
    git checkout -b feat/user-profile-page

    # Exemplo para uma correção
    git checkout -b fix/auth-form-validation
    ```

2.  Faça um **Commit** das suas mudanças seguindo o [Padrão de Commits](#-padrão-de-commits).

3.  Faça um **Push** da sua branch para o repositório remoto.

    ```bash
    git push origin feat/user-profile-page
    ```

4.  Abra um **Pull Request** no GitHub, detalhando as alterações realizadas para que o time possa revisar.
