const request = require('request')

const forecast = (latitude, longitude, callback) => {

  const url = 'http://api.weatherstack.com/current?access_key=616d840e452af1561f491ea0f33903c2&query=' + latitude + ',' + longitude + '&units=f'

  request({ url, json: true }, (error, { body }) => {

    if (error) {
      callback('Unable to connect to weather services!', undefined)
    
    } else if (body.error) {
      callback('Unable to find location', undefined)
    
    } else {
      //console.log(body.current)
      
      const data = body.location.name + '. ' 
      + body.current.weather_descriptions[0] + '. It is currently ' 
      + body.current.temperature  + ' degree out. It feels like '
      + body.current.feelslike + ' degree out. The humidity is '
      + body.current.humidity + '%.'
      
      callback(undefined, data)
    }
  
  })

}

module.exports =  forecast