# API Backup e Consulta de Dados

**🚀 Uma API para consumo de dados de API externa e armazenamento em banco de dados.**

- [Funcionalidades](#funcionalidades)
- [Configuração](#configuracao)
- [Rotas](#rotas)
- [Roadmap](#roadmap)
- [Contribuição](#contribuicao)
- [Licença](#licenca)
- [Contato](#contato)

## ✨ Funcionalidades (`#funcionalidades`)

A API possui as seguintes funcionalidades principais:

🌐 Consumo da API externa: A API realiza requisições à API Externa para obter dados relevantes.

💾 Armazenamento de dados: Os dados obtidos da API externa são armazenados em um banco de dados SQL, arquivos são baixados e salvos no servidor e referenciados no banco de dados.

🔒 Rota de backup: A API disponibiliza uma rota para realizar o backup dos dados da API externa, salvando-os no banco de dados.

🔍 Rota de consulta: A API fornece uma rota para consultar as informações armazenadas no banco de dados.

## ⚙️ Configuração {#configuracao}

Siga as etapas abaixo para configurar o projeto em seu ambiente local:

1. **Clone o repositório do GitHub:**
```nodejs
git clone https://github.com/Velofuri/AtendimentoWhatszap.git
```

3. **Instale as dependências do projeto:**
```nodejs
npm install
```

5. **Configure as variáveis de ambiente:**

- Renomeie o arquivo `.env.example` para `.env`.
- Preencha as variáveis de ambiente no arquivo `.env` com as informações relevantes, como as chaves cliente e password da API externa e as configurações do banco de dados.

4. **Execute o arquivo para criar o banco de dados:**
```nodejs
node src/config/criarBancoDeDados.js
```


6. **Execute o projeto:**
```nodejs
npm start
```


8. **A API estará disponível localmente em `http://localhost:3000`.**

## 🛣️ Rotas {#rotas}

A API possui as seguintes rotas disponíveis:

- **`GET /atendimento/backup/historico`**: Executa o backup dos dados da API externa e os salva no banco de dados.
- **`GET /atendimento/historico/:protocolo`**: Retorna as informações por protocolo, armazenadas no banco de dados.

## 🗺️ Roadmap {#roadmap}

A seguir, estão as próximas etapas planejadas para o desenvolvimento deste projeto:

- Implementar autenticação e autorização nas rotas.
- Adicionar suporte a paginação na rota de consulta de dados.
- Implementar testes automatizados.
- Adicionar documentação detalhada sobre as rotas da API.
- adicionar novas rotas de consulta 

## 🤝 Contribuição {#contribuicao}

As contribuições para o projeto são bem-vindas. Se você deseja contribuir, siga as etapas abaixo:

1. Faça um fork do repositório.
2. Crie uma branch para sua feature:
   
```nodejs
git checkout -b minha-feature
```

3. Desenvolva sua feature e faça commit das alterações:
```nodejs
git commit -m "Minha nova feature"
```
4. Faça push da branch para o repositório remoto:
```nodejs
git push origin minha-feature
```
5. Abra um pull request no repositório original.

## 📄 Licença {#licenca}

Ainda não implementado

## 📧 Contato {#contato}

Se você tiver alguma dúvida ou sugestão em relação a este projeto, entre em contato com velofuri@gmail.com












