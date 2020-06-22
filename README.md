# coronavirus-api

API REST para consulta de dados sobre o coronavírus (COVID-19) em países e estados de todo o mundo.

#### Sobre dos dados

Os dados utilizados pela API são "raspados" da página do *[Google News](https://news.google.com/covid19/map?hl=pt-BR&gl=BR&ceid=BR:pt-419)* a cada 4 horas e armazenados no arquivo [coronavirus-data.json](https://github.com/ArturMiguel/coronavirus-api/blob/master/src/scrapers/coronavirus-data.json). Essa página tem como fonte a Wikipédia, que coleta os dados de origens distintas e os mantêm atualizados constantemente ([ler mais sobre os dados](https://support.google.com/websearch/answer/9814707?p=cvd19_statistics&hl=pt-BR&visit_id=637240065865642349-2968813171&rd=1)).

## Documentação

A documentação completa dos *endpoints* pode ser acessada [aqui](https://coronavirus-api.glitch.me/api/v1/docs).

## Execução

> Requer [Node.js](https://nodejs.org/en/) instalado.

1) Faça o download do projeto.
2) Instale as dependências: `npm install`.
3) Utilize `npm run start` para iniciar a aplicação.

Caso deseje hospedar na Heroku, adicione [esse](https://elements.heroku.com/buildpacks/jontewks/puppeteer-heroku-buildpack) buildpack do Puppeteer.

## Inspirações

> https://news.google.com/covid19/map?hl=pt-BR&gl=BR&ceid=BR:pt-419

> https://github.com/NovelCOVID/API
