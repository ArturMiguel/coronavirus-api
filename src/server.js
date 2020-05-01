const app = require('./app')
const countriesScraper = require('./scrapers/countries')

app.listen(process.env.PORT || 3000, () => {
    console.log('Server started!')

    setInterval(async () => {
        await countriesScraper()
    }, 1000 * 60 * 60 * 12)
})