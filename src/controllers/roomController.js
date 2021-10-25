const Database = require('../db/config')

module.exports = {
  async create(req, res) {
    const db = await Database()
    const pass = req.body.codeSala
    var roomId
    var isRoom = true

    while (isRoom) {
      // Gera o número da sala
      for (var i = 0; i < 6; i++) {
        i == 0
          ? (roomId = Math.floor(Math.random() * 10).toString())
          : (roomId += Math.floor(Math.random() * 10).toString())
      }

      // Verifica se esse número já existe
      const roomsExistIds = await db.all(`SELECT * FROM rooms`)
      isRoom = roomsExistIds.some(roomExistId => roomExistId === roomId)
      if (!isRoom) {
        // Insere sala no banco
        await db.run(`INSERT INTO rooms (
          id,
          pass
        )VALUES (
          ${parseInt(roomId)},
          ${pass}
        )`)
      }
    }

    await db.close()

    res.redirect(`/room/${roomId}`)
  },

  async open(req, res) {
    const db = await Database()
    const roomId = req.params.room
    const questions = await db.all(
      `SELECT * FROM questions WHERE room = ${roomId} and read = 0`
    )
    const questionsRead = await db.all(
      `SELECT * FROM questions WHERE room = ${roomId} AND read = 1`
    )

    let isNoQuestions

    if (questions.length == 0) {
      if (questionsRead.length == 0) {
        isNoQuestions = true
      }
    }
    await db.close()

    res.render('room', {
      roomId: roomId,
      questions: questions,
      questionsRead: questionsRead,
      isNoQuestions: isNoQuestions
    })
  },

  async enter(req, res) {
    const db = await Database()
    const roomId = req.body.roomId

    const existRoom = await db.get(`SELECT * FROM rooms WHERE id = ${roomId}`)

    await db.close()
    if (!existRoom) {
      res.render('roomincorrect')
    } else {
      if (existRoom.id == roomId) {
        res.redirect(`/room/${roomId}`)
      } else {
        res.render('roomincorrect')
      }
    }
  }
}
