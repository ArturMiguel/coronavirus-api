const app = require('./app')
const countriesScraper = require('./scrapers/countries')

app.listen(process.env.PORT || 3000, () => {
    console.log('Server started!')

    setInterval(async () => {
        console.log('Atualizando dados...')
        await countriesScraper().then(() => {
            console.log('Os dados foram atualizados!')
        })
    }, 1000 * 60 * 60 * 6)
})