'use strict'

const confData = require('../data/conf-data.json')

const startConversation = require('./start-conversation')
const getSchedule = require('./get-schedule')
const showTrack = require('./show-track')
const showAllTracks = require('./show-all-tracks')
const talksInfo = require('./talks-info')
const talkInfoById = require('./talk-info-by-id')
const conferenceInfo = require('./conference-info')
const followOnTwitter = require('./follow-on-twitter')
const aboutSpeaker = require('./about-speaker')
const topicList = require('./topic-list')
const getWebsite = require('./get-website')
const getLocation = require('./get-location')
const getHelp = require('./get-help')
const mainMenu = require('./main-menu')
const doNotUnderstand = require('./do-not-understand')

function isInArray(value, arr) {
  return arr.map(item => item.toLowerCase()).indexOf(value.toLowerCase()) > -1
}

module.exports = function botFlow(message, lang) {
  if (message.text === '/start' || message.text === '/start start')
    return startConversation(lang)

  if (isInArray(message.text, ['schedule', 'рассписание']) || message.text === '/schedule')
    return getSchedule(lang)

  let trackNumber = parseInt(message.text.toLowerCase().replace(/track|трек (\d)/gi, '$1'), 10)
  if (!isNaN(trackNumber) && trackNumber > 0 && trackNumber < 4)
    return showTrack(trackNumber, lang)

  if (message.text.toLowerCase() === 'all tracks')
    return showAllTracks(lang)

  if (isInArray(message.text, ['current and next talk info', 'информация о текущем и следующем докладе']) || message.text === '/talk-info')
    return talksInfo(lang)

  if (confData.schedule.map(item => item.id.toLowerCase()).indexOf(message.text.toLowerCase()) > -1)
    return talkInfoById(message.text.toLowerCase(), lang)

  if (isInArray(message.text, ['info', 'информация']) || message.text === '/info')
    return conferenceInfo(lang)

  if (/^Follow @([0-1a-zA-Z_]{1,50}) on twitter$/i.test(message.text.toLowerCase()))
    return followOnTwitter(message.text.toLowerCase().replace(/^Follow @([0-1a-zA-Z_]{1,50}) on twitter$/ig, '$1'), lang)

  if (/^About ([0-1a-zA-Z -]{1,100})$/i.test(message.text.toLowerCase()))
    return aboutSpeaker(message.text.toLowerCase().replace(/^About ([0-1a-zA-Z -]{1,100})$/i, '$1'), lang)

  if (isInArray(message.text, ['list of topics', 'Список тем']))
    return topicList(lang)

  if (isInArray(message.text, ['website', 'Сайт']))
    return getWebsite()

  if (isInArray(message.text, ['location', 'местоположение'])  || message.text === '/location')
    return getLocation(lang)

  if (isInArray(message.text, ['help', 'помощь'])  || message.text === '/help')
    return getHelp(lang)

  if (isInArray(message.text, ['back to the main menu', 'назад в главное меню'])  || message.text === 'main menu')
    return mainMenu({
      en: `Here's a few things that I can help you with:`,
      ru: `Вот что я могу для вас сделать:`
    }, lang)

  return doNotUnderstand(lang)
}