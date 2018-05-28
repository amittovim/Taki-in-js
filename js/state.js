var GameState = {
    drawPile: null,
    discardPile: null,
    players: null,
    currentPlayer: null,
    leadingCard: null,
    activeCard: null,
    activeAction: null,
    turnNumber: 0,
    time: {
        interval: null,
        seconds: {
            value: 0,
            element: $('.game-seconds')
        },
        minutes: {
            value: 0,
            element: $('.game-minutes')
        }
    },
    turnTime: {
        interval: null,
        seconds: {
            value: 0,
            element: $('.turn-seconds')
        },
        minutes: {
            value: 0,
            element: $('.turn-minutes')
        }
    },
    navbar: {
        currentPlayer: $('.current-player'),
        turnNumber: $('.turn-number'),
        endTurnButtonEnabled: false
    },
    popups: {
        welcome: {
            isOpen: false,
            element: $('.welcome-popup')
        },
        color: {
            isOpen: false,
            element: $('.choose-color-popup')
        },
        endGame: {
            isOpen: false,
            element: $('.end-game-popup')
        },
        winner: {
            isOpen: false,
            element: $('.winner-popup')
        },
        technicalWinnder: {
            isOpen: false,
            element: $('.technical-winner-popup')
        }
    },
    stats: {
        totalMoveTime: {
            seconds: 0,
            minutes: 0
        },
        averageMoveTime: {
            seconds: 00,
            minutes: 00
        }
    }
};


