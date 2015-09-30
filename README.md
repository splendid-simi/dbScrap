# dbScrape

This repo contains a basic node server that fetches events from the Santa Monica Parking API every 10 seconds. This data is then updated in a firebase database.

### IMPORTANT: If you clone this repo, create a file in the root directory called firebaselink.js that contains:

module.exports = { url: 'URL for your firebase database' }
