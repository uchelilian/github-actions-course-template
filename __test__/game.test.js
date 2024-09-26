const Game = require('../src/game').default
const fs = require('fs')

describe('App', () => {
  it('Contains the compiled JavaScript', async () => {
    const data = await new Promise((resolve, reject) => {
      fs.readFile('./public/main.js', 'utf8', (err, data) => {
        if (err) return reject(err)
        resolve(data)
      })
    })

    expect(data).toMatchSnapshot()
  })
})

describe('Game', () => {
  let game, p1, p2

  beforeEach(() => {
    p1 = 'Salem'
    p2 = 'Nate'
    game = new Game(p1, p2)
  })

  describe('Initialization', () => {
    it('Initializes with two players', () => {
      expect(game.p1).toBe('Salem')
      expect(game.p2).toBe('Nate')
    })

    it('Initializes with an empty board', () => {
      for (let r = 0; r < game.board.length; r++) {
        for (let c = 0; c < game.board[r].length; c++) {
          expect(game.board[r][c]).toBeUndefined() // Fixed typo from 'lenght' to 'length'
        }
      }
    })

    it('Starts the game with a random player', () => {
      Math.random = () => 0.4 // Mock Math.random
      expect(new Game(p1, p2).player).toBe('Salem')

      Math.random = () => 0.6 // Mock Math.random
      expect(new Game(p1, p2).player).toBe('Nate')
    })
  })

  describe('turn', () => {
    it("Inserts an 'X' into the top center", () => {
      game.turn(0, 1)
      expect(game.board[0][1]).toBe('X')
    })

    it("Inserts an 'X' into the top left", () => {
      game.turn(0)
      expect(game.board[0][0]).toBe('X')
    })
  })

  describe('nextPlayer', () => {
    it('Sets the current player to be whoever it is not', () => {
      Math.random = () => 0.4 // Mock Math.random
      expect(game.player).toBe('Nate')
      game.nextPlayer()
      expect(game.player).toBe('Nate')
    })
  })

  describe('hasWinner', () => {
    it('Wins if any row is filled', () => {
      for (let r = 0; r < game.board.length; r++) {
        for (let c = 0; c < game.board[r].length; c++) {
          game.board[r][c] = 'X'
        }
        expect(game.hasWinner()).toBe(true)

        for (let c = 0; c < game.board[r].length; c++) {
          game.board[r][c] = undefined // Clear the row
        }
      }
    })

    it('Wins if any column is filled', () => {
      for (let r = 0; r < game.board.length; r++) {
        for (let c = 0; c < game.board[r].length; c++) {
          game.board[c][r] = 'X'
        }
        expect(game.hasWinner()).toBe(true)

        for (let c = 0; c < game.board[r].length; c++) {
          game.board[c][r] = undefined // Clear the column
        }
      }
    })

    it('Wins if down-left diagonal is filled', () => {
      for (let r = 0; r < game.board.length; r++) {
        game.board[r][r] = 'X'
      }
      expect(game.hasWinner()).toBe(true)
    })

    it('Wins if up-right diagonal is filled', () => {
      for (let r = 0; r < game.board.length; r++) {
        game.board[2 - r][r] = 'X'
      }
      expect(game.hasWinner()).toBe(true)
    })
  })
})
