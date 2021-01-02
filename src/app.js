const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 5000

// Note run this file with >node src/app.js -e js,hbs
// -e => run with extension
// ====================================================
// ===== Define paths for Express config ===== 
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
// ====================================================
// === Setup handlebars engine and views location ===

// 1) Tell express to us hbs (handle bars) as a view engine
app.set('view engine', 'hbs')

// 2) express set default template view directory to the name 'views'
// so here we tell express that the default 'views' directory is called 'templates'
// referenced by the viewsPath constant above
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// ====================================================
// === Setup static directory to serve ===
app.use(express.static(publicDirectoryPath))


// ====================================================
// ==== Code start ====

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    name: 'Narumol Pugkhem'
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'Narumol Pugkhem'
  })
})

app.get('/help', (req, res) => {
  res.render('help', {
    helpText: 'This is some helpful text.',
    title: 'Help.',
    name: 'Narumol Pugkhem'
  })
})


app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'Address must be provided'
    })
  }
  geocode(req.query.address, (error, { latitude, longitude, location } = {} ) => {
    if (error) {
      console.log('sending error from geocode')
      return res.send({ error })
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        console.log('sending error from forecast')
        return res.send({ error })
      }

      res.send({
        address: req.query.address,
        forecast: forecastData,
        location: location
      })

    })


  })

})


app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term'
    })
  }

  console.log(req.query.search)

  res.send({
    products: []
  })
})

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404 help',
    name: 'Narumol',
    errorMessage: 'Help article not found'
  })
})

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Narumol',
    errorMessage: 'Page Not Found'
  })
})

app.listen(port, () => {
  console.log('Server is up on port ' + port)
})