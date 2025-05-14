# 🚀 Instruções para Executar o Projeto

Certifique-se de que sua máquina atenda aos requisitos abaixo antes de iniciar o projeto:

- [Node.js](https://nodejs.org/) **(versão 16 utilizada neste projeto)**
- [npm](https://www.npmjs.com/)

Tecnologias utilizadas:
<div align="center">
  <img src="https://nodejs.org/static/images/logo.svg" alt="Node.js" width="100" height="100"/>
  <img src="https://cdn.worldvectorlogo.com/logos/typescript.svg" alt="TypeScript" width="100" height="100"/>
  <img src="https://www.mongodb.com/assets/images/global/leaf.png" alt="MongoDB" width="100" height="100"/>
</div>

1. **Clone o repositório (caso ainda não tenha feito isso):**
   ```bash
   git clone https://seu-repositorio.git
   cd nome-do-projeto
   ```

2. **Instale as dependências do projeto:**
   ```bash
   npm install
   ```

3. **Inicialize o servidor Express:**
   ```bash
   npm start
   ```

4. **Acesse a documentação dos endpoints (Swagger):**
   > Após o servidor estar rodando, acesse no navegador:
   ```
   http://localhost:3000/api-docs#/
   ```

5. **Conexão com o banco de dados:**
   A conexão com o MongoDB já está configurada. O projeto utiliza a seguinte URL padrão:
   ```
   mongodb://localhost:27017/desafiobackend
   ```
