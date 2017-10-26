const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const TelegramBot = require('node-telegram-bot-api');
const server = require('http').Server(app.callback())
const io = require('socket.io')(server)

const index = require('./routes/index')


// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())


// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

// replace the value below with the Telegram token you receive from @BotFather
const token = '275319626:AAEN8GCS1SqWhMIhWhcqlJN66JwDbwURVNU';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Listen for any kind of message. There are different kinds of
// messages.

let socket_id = ''
const comments = []
bot.on('message', (msg) => {
  console.log(msg)
  comments.push(msg)
  if(socket_id != '')
    io.sockets.connected[socket_id].emit('newMessage', JSON.stringify(msg))
})

io.on('connection', socket => {
  socket.on('register', () => {
    socket_id = socket.id;
    console.log('Initiated connection with ' + socket_id)
  })
  socket.on('fetchMessages', () => {
    socket.emit('messages', comments)
  })
})

server.listen('8888')

/*
{ message_id: 215184,
  from:
   { id: 51439504,
     is_bot: false,
     first_name: '✓ 규진',
     last_name: '✓ 조',
     username: 'RealCovfefe' },
  chat: { id: -1001113221584, title: '앵무그룹', type: 'supergroup' },
  date: 1509039545,
  text: 'ㅅㅂ머야이거' }
*/

module.exports = app
