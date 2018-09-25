const net = require('net')
const fs = require('fs')

const readFile = (filename) => {
    return fs.readFileSync(`./${filename}`)
}

// ASCII emoji data from https://github.com/dysfunc/ascii-emoji
const emojiTable = {
    'innocent face': 'ʘ‿ʘ',
    "reddit disapproval face": "ಠ_ಠ",
    "table flip": "(╯°□°）╯︵ ┻━┻",
    "put the table back": "┬─┬﻿ ノ( ゜-゜ノ)",
    "tidy up": "┬─┬⃰͡ (ᵔᵕᵔ͜ )",
    "double flip": "┻━┻ ︵ヽ(`Д´)ﾉ︵﻿ ┻━┻",
    "fisticuffs": "ლ(｀ー´ლ)",
    "cute bear": "ʕ•ᴥ•ʔ",
    "squinting bear": "ʕᵔᴥᵔʔ",
    "GTFO Bear": "ʕ •`ᴥ•´ʔ",
    "cute face with big eyes": "(｡◕‿◕｡)",
    "surprised": "（　ﾟДﾟ）",
    "shrug face": "¯\_(ツ)_/¯",
    "meh": "¯\(°_o)/¯",
    "feel perky": "(`･ω･´)",
    "happy face": "ヽ(´▽`)/"
}

// Helper to send a bad request response 
const badRequest = (socket) => {
    const response = { code: emojiTable['reddit disapproval face'] }
    socket.write(`::${JSON.stringify(response)}::`)
}

let bufferMessage = ''

const server = net.createServer(socket => {
    socket.on('connection', () => {
        console.log('Connection has been made.')
    })

    socket.on('data', data => {
        const dataString = data.toString()
        if (dataString.startsWith('::')) {
            // this marks the beginning of the message
            bufferMessage = ''
        }

        bufferMessage += dataString

        if (dataString.endsWith('::')) {
            // this marks the the end of the message
            processRequest(socket)
        }
    })

    socket.on('error', (error) => {
        console.error('Error:')
        console.error(error)
    })

    socket.on('end', () => {
        console.log('Connection closed.')
    })
})

server.listen(8080, '127.0.0.1')

const processRequest = (socket) => {
    // Remove colon delimiters and parse as json
    const colonLength = 2 // '::' is 2 characters
    const buffer = bufferMessage.substring(colonLength, bufferMessage.length - colonLength)
    const dataJson = JSON.parse(buffer)

    const requestType = dataJson['type'] || undefined
    const requestName = dataJson['name'] || undefined

    if (requestType === 'emoji') {
        const emoji = emojiTable[requestName]
        if (requestName && emoji) {
            const response = {
                code: emojiTable['happy face'],
                body: emoji
            }

            socket.write(`::${JSON.stringify(response)}::`)
        } else {
            // bad request
            badRequest(socket)
        }
    } else if (requestType === 'meme') {
        // read the meme data from file system
        const fileData = readFile('wikipedia-meme.jpg')
        
        // respond with image data
        const response = {
            code: emojiTable['happy face'],
            body: fileData,
            type: 'image/jpg'
        }

        socket.write(`::${JSON.stringify(response)}::`)
    } else {
        // bad request
        badRequest(socket)
    }

    socket.pipe(socket)
    socket.end()
}
