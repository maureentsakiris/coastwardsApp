const translations = require( '../translations.js' )


const translationArray = Object.entries(translations)

const messages = {}

for (const [key, translation] of translationArray) {
  	messages[key] = translation['zh']
}

module.exports = messages