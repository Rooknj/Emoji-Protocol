const net = require('net');

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

const server = net.createServer(socket => {
    socket.on('data', data => {
        const dataText = data.toString()
        // parse the incoming text as json
        const dataJson = JSON.parse(dataText)
        console.log(dataJson)

        const requestType = dataJson['type'] || undefined
        const requestName = dataJson['name'] || undefined

        if (!requestType) {
            // bad request
            const response = { code: emojiTable['reddit disapproval face'] }
            socket.write(JSON.stringify(response))
        }

        const emoji = emojiTable[requestName]
        if (requestName && emoji) {
            const response = {
                code: emojiTable['happy face'],
                body: emoji
            }
            socket.write(JSON.stringify(response))
        } else {
            // bad request
            const response = { code: emojiTable['reddit disapproval face'] }
            socket.write(JSON.stringify(response))
        }
    })

	socket.pipe(socket)
})

server.on('error', error => {
    console.error(error)
    server.end()
})

server.listen(8080, '10.0.2.106')


