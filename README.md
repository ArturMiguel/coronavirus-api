# coronavirus-api

API para consulta de dados sobre o coronavírus (COVID-19) em países e estados de todo o mundo.

## Sobre os dados

Os dados utilizados pela API são "raspados" da página do *[Google News](https://news.google.com/covid19/map?hl=pt-BR&gl=BR&ceid=BR:pt-419)* a cada 4 horas e armazenados no arquivo [coronavirus-data.json](src/scraper/coronavirus-data.json). Essa página tem como fonte a Wikipédia, que coleta os dados de origens distintas e os mantêm atualizados constantemente ([ler mais sobre os dados](https://support.google.com/websearch/answer/9814707?p=cvd19_statistics&hl=pt-BR&visit_id=637240065865642349-2968813171&rd=1)).

Esse projeto foi criado para praticar *web scraping* e não é recomendado que o utilize em sistemas já em produção. Além disso, quando a API fica ociosa, ou seja, não recebe requisições por um tempo, ela é desligada e volta a ficar ativa na próxima requisição, o que pode fazer a resposta demorar.

## Documentação e testes

Documentação completa dos *endpoints* e testes podem ser acessados por [aqui](https://coronavirus-dev.herokuapp.com/api/v1/docs).

## Instalação e execução

> Requer o [Node.js](https://nodejs.org/en/).

1) Faça o *download* do projeto.
2) Na raiz do projeto, instale as dependências: 
```
npm install
```
3) Para executar em modo de desenvolvimento:
```
npm run dev
```
4) (opcional) Para iniciar em modo de produção, crie uma *build* com suas alterações e após isso inicie o servidor:

```
npm run build
```
```
npm run start
```

> Para executar na plataforma Heroku é necessário instalar o [buildpack do Puppeteer](https://elements.heroku.com/buildpacks/jontewks/puppeteer-heroku-buildpack).

## Licença

[MIT License](LICENSE)