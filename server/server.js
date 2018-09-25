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
    socket.on('data', data => {
        const dataString = data.toString()
        if (dataString.startsWith('::')) {
            // this is the beginning of the message
            bufferMessage = ''
        }

        bufferMessage += dataString

        if (dataString.endsWith('::')) {
            // this is the end of the message
            socket.end()
        }

        // if (dataString.startsWith('::')) {
        //     // this is the beginning of the message
        //     buffer += dataString.substr(3)
        //     console.log('started')
        // }
        // if (dataString.endsWith('::')) {
        //     // this is the end of the message
        //     const dataLength = dataString.length
        //     buffer += dataString.substr(0, dataLength - 3)
        //     console.log('ended')

        //     socket.end()
        // } 
        // if (!dataString.startsWith('::') && !dataString.endsWith('::')) {
        //     // middle of message
        //     buffer += dataString
        // }
    })

    socket.on('error', () => {
        console.log('Error!')
    })

    socket.on('end', () => {
        console.log('Incoming data:', bufferMessage)
        const dataJson = JSON.parse(bufferMessage)

        const requestType = dataJson['type'] || undefined
        const requestName = dataJson['name'] || undefined

        if (!requestType) {
            // bad request
            badRequest(socket)
        }

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
    })
})

server.on('error', error => {
    console.error(error)
    server.end()
})

server.listen(8080, '127.0.0.1')
