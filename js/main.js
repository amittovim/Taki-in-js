
var dealer = new Player('Dealer',null);

// ±±±±± Game Init ±±±±±

function initGame() {
    initStatistics();
    dropAllPopUp();
    GameState.currentPlayer = dealer;

    createPlayers();
    createDrawPile();
    createDiscardPile();
    dealHands();
    drawStartingCard();
    pickFirstPlayer();
    startClock(GameState.time);
    startClock(GameState.turnTime);
    updateStatistics();
    if (GameState.currentPlayer === GameState.players.bot) {
        setTimeout(function () {
            playNextBotMove();
        }, 1000);
    }
}

// == Create Players ==

function createPlayers() {
    GameState.players = {
        bot: new Player('bot', $('.bot-hand')),
        human: new Player('human', $('.human-hand'))
    };
}

function pickFirstPlayer() {
    var randomNumber = getRandomInt(0, 1);
    GameState.currentPlayer = randomNumber === 0 ? GameState.players.bot : GameState.players.human;
    printLogOnDom(' play your turn!');
}

// == Create Draw Pile ==

function createDrawPile() {
    GameState.drawPile = new Pile([], $('.draw-pile'), 'Draw Pile');
    createDrawPileModel();
    shuffleArray(GameState.drawPile.cards);
    createDrawPileDOM();
    function createDrawPileModel() {
        var cardId = 0;
        createNumberCardsModel();
        createActionCardsModel();

        function createNumberCardsModel() {
            for (var number in CardNumberEnum) {
                if (number === 2) {
                    continue;
                }
                for (var i = 1; i <= 2; i++) {
                    for (var color in ColorEnum) {
                        var newCard = new Card(cardId++, GameState.drawPile, ColorEnum[color], CardNumberEnum[number]);
                        GameState.drawPile.cards.push(newCard);
                    }
                }
            }
        }

        function createActionCardsModel() {
            for (var action in CardActionEnum) {
                if (CardActionEnum[action] !== CardActionEnum.ChangeColor) {
                    for (i = 1; i <= 2; i++) {
                        for (color in ColorEnum) {
                            var newCard = new Card(cardId++, GameState.drawPile, ColorEnum[color], null, CardActionEnum[action]);
                            GameState.drawPile.cards.push(newCard);
                        }
                    }
                } else {
                    for (j = 1; j <= 4; j++) {
                        var newCard = new Card(cardId++, GameState.drawPile, null, null, CardActionEnum.ChangeColor);
                        GameState.drawPile.cards.push(newCard);
                    }
                }
            }
        }
    }

    function createDrawPileDOM() {
        GameState.drawPile.cards.forEach(function (card) {
            card.element = createCardElement(card);
            GameState.drawPile.element.appendChild(card.element);
        });
    }
}

function createCardElement(currentCard) {
    var cardAttributes = [
        {name: 'id', value: 'card-' + currentCard.id},
        {name: 'style', value: 'color:' + currentCard.color}
    ];

    var cardContainerElement = createElement('div', null, ['card-container'], null);
    cardContainerElement.addEventListener('click', function () {
        onCardClick(currentCard);
    });

    var cardElement = createElement('div', null, ['card', 'shadow', 'rounded'], cardAttributes);

    cardContainerElement.appendChild(cardElement);

    var frontCard = createElement('div', null, ['front-card', 'shadow', 'rounded']);
    createCardFront(frontCard, currentCard);
    cardElement.appendChild(frontCard);

    var backCard = createElement('div', null, ['back-card', 'shadow', 'rounded']);
    createCardBack(backCard);
    cardElement.appendChild(backCard);

    if (!currentCard.isHidden) {
        backCard.setAttribute('style', 'top: 0%');
        frontCard.setAttribute('style', 'top: -100%');
        backCard.parentNode.insertBefore(backCard, frontCard);
    }
    return cardContainerElement;

    function createCardFront(frontCard, currentCard) {

        // TODO: refactor
        currentCard.color ? frontCard.style.color = currentCard.color : frontCard.style.color = 'BLACK';

        var cardTop = createElement('div', null, ['card-top']);
        var cardCenter = createElement('div', null, ['card-center']);
        var cardBottom = createElement('div', null, ['card-bottom']);
        frontCard.appendChild(cardTop);
        frontCard.appendChild(cardCenter);
        frontCard.appendChild(cardBottom);

        var icon,i;
        // Top
        for ( i = 1; i <= 2; i++) {
            icon = createElement('div', currentCard.getDisplay());
            cardTop.appendChild(icon);
        }

        // Center
        icon = createElement('div', currentCard.getDisplay());
        cardCenter.appendChild(icon);

        // Bottom
        for ( i = 1; i <= 2; i++) {
            icon = createElement('div', currentCard.getDisplay());
            cardBottom.appendChild(icon);
        }
    }

    function createCardBack(backCard) {

        var cardCover = createElement('div', null, ['card-cover']);
        backCard.appendChild(cardCover);

        var img = createElement('img', null, null, [{name: 'src', value: 'assets/img/TAKI.jpg'}, {
            name: 'alt',
            value: 'Taki cover'
        }]);
        cardCover.appendChild(img);
    }
}

// == Create Discard Pile ===

function createDiscardPile() {
    GameState.discardPile = new Pile([], $('.discard-pile'), 'Discard Pile');
}

function drawStartingCard() {
    var topCard;
    do {
        // It draws another card if the card drawn is CHANGE COLOR because you cannot start a game with this card
        topCard = GameState.drawPile.getTop();
        moveCard(topCard, GameState.drawPile, GameState.discardPile);
    } while (topCard.action === CardActionEnum.ChangeColor);

    // in case first card is STOP than move the turn to the next player
    if (topCard.action === CardActionEnum.Stop) {
        var shouldSwitchPlayers = true;
        endTurn(shouldSwitchPlayers);
    }
}

// == Deal Hands ==

function dealHands() {
    var numberOfCardsInHand = 8;
    for (var i = 1; i <= numberOfCardsInHand; i++) {
        for (var player in GameState.players) {
            moveCard(GameState.drawPile.getTop(), GameState.drawPile, GameState.players[player].hand);
        }
    }
}

// ±±±±± Access ±±±±±

function getCardIndex(targetCard, pile) {
    return pile.cards.findIndex(function (card) {
        return targetCard === card;
    });
}

// ±±±±± Game Actions ±±±±±

function onCardClick(card) {
    if ( (card.container === GameState.players.human.hand) || (card.container === GameState.drawPile) ) {
        GameState.activeCard = card;
        playMove();
    }
}

function playerWon() {
    return ( GameState.currentPlayer.hand.cards.length === 0 && GameState.activeAction !==CardActionEnum.Stop );
}

function playMove() {
    var card = GameState.activeCard;
    var source = card.container;
    var destination = getDestination();
    var shouldSwitchPlayers = false;

    switch (GameState.currentPlayer) {
        case GameState.players.bot: {
            moveCard(card, source, destination);
            shouldSwitchPlayers = playMoveManager();
            break;
        }
        case GameState.players.human: {
            if (!isMoveLegal(card)) {
                printLogOnDom('Invalid move!');
                return;
            } else {
                moveCard(card, source, destination);
                shouldSwitchPlayers = playMoveManager();
            }
            break;
        }
        default: {
            break;
        }
    }

    endTurn(shouldSwitchPlayers);
}

function playMoveManager() {
    var card = GameState.activeCard;
    var player = GameState.currentPlayer;
    var shouldSwitchPlayer = true;

    if (card.container === GameState.discardPile) {
        raiseActionFlag();
    }

    if (player.hand.cards.length === 1) {
        player.singleCardCounter++;
    }

    if (GameState.activeAction === CardActionEnum.ChangeColor) {
        // if ( ( card.action === CardActionEnum.ChangeColor )&& (card === GameState.leadingCard) ) {
        if (player === GameState.players.bot) {
            var ccNewColor = pickRandomColor();
            change2Color(ccNewColor);
            // shouldSwitchPlayer = false;
        } else {
            shouldSwitchPlayer = false;
            loadPopUp('.choose-color-popup');
        }
    } else if ( (card.action === CardActionEnum.Stop) && (GameState.activeAction === CardActionEnum.Stop) ) {
        shouldSwitchPlayer = false;
        GameState.turnNumber++;
        $('.turn-number').textContent = GameState.turnNumber;
        if (player === GameState.players.bot) {
        }
    } else if (GameState.activeAction === CardActionEnum.Taki) {
        shouldSwitchPlayer = !doesHandHaveSameColorCards();
    }

    return shouldSwitchPlayer;
}

function raiseActionFlag() {
    // if current card isn't an action there's nothing to raise so we leave the function
    if (!GameState.activeCard.isActionCard()) {
        return;
    // if current card is an action card
    } else {
        // if current action-flag is DIFFERENT than TAKI then update action-flag
        // value to be the action on our current card, in memory and on screen.
        if ( GameState.activeAction !== CardActionEnum.Taki) {
            GameState.activeAction = GameState.activeCard.action;
          //  $('.active-action').textContent = GameState.activeAction;

        // if current action-flag IS taki and player has no more cards with same color to put on it
        // update the action-flag value to the action of the card we just used
        } else {
            var matchedCard = getCardInHand(GameState.currentPlayer, [{color: GameState.leadingCard.color}]);
            if (matchedCard === undefined ) {  //if (!availableMoveExist()) {
                GameState.activeAction = GameState.activeCard.action;
               // $('.active-action').textContent = GameState.activeAction;
            }
        }
    }
}

function endTurn(shouldSwitchPlayers) {
    // restock draw pile if needed
    if (GameState.drawPile.cards.length === 0) {
        restockDrawPile();
    }
    // if player won, show winner popup
    if ( (GameState.currentPlayer !== dealer) && (playerWon()) ) {
        $('#winner-name').textContent = GameState.currentPlayer.name;
        // loadPopUp('.winner-popup');
        declareWinner();
        return;
    }

    if (shouldSwitchPlayers) {
        GameState.activeAction = null;
       // $('.active-action').textContent = '';
        switchPlayers();
    } else if (GameState.currentPlayer === GameState.players.bot) {
        setTimeout(function () {
            playNextBotMove();
        }, 1000);
    }
}

function switchPlayers() {
    if (GameState.currentPlayer === GameState.players.bot) {
        GameState.currentPlayer = GameState.players.human;
        disableElement('.loader');
        enableElement('.separator');
        // disableElement('.transparent-overlay');
        disableElement('.overlay');
    } else {
        // enableElement('.transparent-overlay');
        enableElement('.overlay');
        disableElement('.separator');
        enableElement('.loader');
        GameState.currentPlayer = GameState.players.bot;
        setTimeout(function () {
            playNextBotMove();
        }, 1000);
    }
    updateStatistics();
}

function shouldFlipCard(sourcePile, destinationPile) {
    var fromHuman = sourcePile === GameState.drawPile && destinationPile === GameState.players.human.hand;
    var fromBot = sourcePile === GameState.players.bot.hand && destinationPile === GameState.discardPile;
    var drawingFirstCard = sourcePile === GameState.drawPile && destinationPile === GameState.discardPile;
    var restockingDrawPile = sourcePile === GameState.discardPile && destinationPile === GameState.drawPile;
    return fromHuman || fromBot || drawingFirstCard || restockingDrawPile;
}

function moveCard(card, sourcePile, destinationPile) {
    moveCardModel(card, sourcePile, destinationPile);
    moveCardDOM(card.element, destinationPile.element);

    if (destinationPile === GameState.discardPile) {
        GameState.leadingCard = card;
    }
    if (shouldFlipCard(sourcePile, destinationPile)) {
        rollOverCard(card);
    }
    //     // TODO : temporary - delete next line and enable these 4 lines above me
    // if (sourcePile === GameState.drawPile || destinationPile.drawPile) {rollOverCard(card);}

    if ( (destinationPile.name === 'Discard Pile') ||
         (destinationPile.name === 'human hand') || (GameState.currentPlayer === GameState.players.human) ) {
        printLogOnDom('card ' + card.getDescription() + ' moved to ' + destinationPile.name);
    } else {
        printLogOnDom('A card was moved to ' + destinationPile.name);
    }
}


function moveCardModel(card, sourcePile, destinationPile) {
    var cardIndex = getCardIndex(card, sourcePile);
    move(cardIndex, sourcePile.cards, destinationPile.cards);
    card.container = destinationPile;
}

function moveCardDOM(cardElement, destinationPileElement, isInsertAsFirst) {
    destinationPileElement.appendChild(cardElement);
}

function getDestination() {
    switch (GameState.activeCard.container) {
        case GameState.drawPile: {
            return GameState.currentPlayer.hand;
        }
        case GameState.currentPlayer.hand: {
            return GameState.discardPile;
        }
        case GameState.discardPile: {
            return GameState.drawPile;
        }
    }
}

function rollOverCard(card) {

    var cardElement = card.element.firstChild;
    var backCard  = cardElement.lastChild;
    if (!card.isHidden) {
        // if card front is visible (not hidden). hide it.
        card.isHidden = true;
        backCard.setAttribute('style',  'z-index: 0');
    } else {
        // if card is hidden. un hide it and display it
        card.isHidden = false;
        backCard.setAttribute('style',  'z-index: -1');
    }
}

//  searching for cards in a player's hand that their "key" property equals the value of "value".
//  Function returns an array that its properties are the indexes of the cards that their key=value are matched.
//  if none were found the array will be empty.
function searchCardsInHand(player, colorOrAction, value) {

    var matchedCardIndexes = [];

    player.hand.cards.forEach(function (card, index) {
        if (card[colorOrAction] === value) {
            matchedCardIndexes.push(index)
        }
    });
    return matchedCardIndexes;
}

// Searches for the first card in the players hand that matches the matches the value to the requested property
// Example: Searching for a card that it's color is red

function getCardInHand(player, conditionList) {
    return getFirstItemByMatchConditions(player.hand.cards, conditionList);
}

// ±±±±± Game Rules ±±±±±

function isMoveLegal(card) {

    var isDrawPileEmpty = !(GameState.drawPile.cards.length > 0);
    var isAskingCardFromDrawPile = card.container === GameState.drawPile;
    var drawLastCardFromDrawPile = ((!isDrawPileEmpty) && ((isAskingCardFromDrawPile) || (card === GameState.drawPile.cards[GameState.drawPile.cards.length - 1])));

    // check if player want to Put a card on discard pile (only the card owner can do it) and if so check if the active card is owned by the current player
    if ( (!drawLastCardFromDrawPile) && ('hand ' + GameState.currentPlayer.name + '-hand player cards-container' === card.element.parentElement.className) ) {
        return isPutCardMoveLegal(card);
    } else {
        // check if player want to Get a card from draw pile
        return isGetCardMoveLegal();
    }
}

function isPutCardMoveLegal(card) {
    var isSameColor;

    // if taki is invoked only cards with the same color are legal
    if (GameState.activeAction === CardActionEnum.Taki) {
        isSameColor = !!(card.color && GameState.leadingCard.color === card.color);
        if (!isSameColor) {
            return false;
        }
    }else {
        isSameColor      = !!(card.color && GameState.leadingCard.color === card.color);
        var isSameNumber = !!(card.number && GameState.leadingCard.number === card.number);
        var isSameAction = !!(card.action && GameState.leadingCard.action === card.action);
        var isUnColoredActionCard = !!(card.action && !card.color);
        if (!(isSameColor || isSameNumber || isSameAction || isUnColoredActionCard)) {
            return false;
        }
    }
    return true;
}

function isGetCardMoveLegal() {
    // checking if drawing Card From DrawPile is a legal move - only if no other move is available for player
    if (availableMoveExist()) {
        return false;
    }
    return true;
}

function pickRandomColor() {
    var randomInt = getRandomInt(0, 3);
    var color = getKey(ColorEnum, randomInt);
    return ColorEnum[color];
}

function delay() {
    var overLaySelector = '.overlay';
    enableElement(overLaySelector);
}

function playNextBotMove() {
    // delay();
    var leadingCard = GameState.leadingCard;
    var activeAction = GameState.activeAction;
    var bot = GameState.players.bot;
    var matchedCard;

    // if you have CC card and you're allowed to put it - mark it as the active card.
    if (matchedCard = getCardInHand(bot, [{action: CardActionEnum.ChangeColor}])) {
        GameState.activeCard = matchedCard;
    }
    // if you have a Stop card and its the same color as the leading card - mark it as the active card.
    else if (matchedCard = getCardInHand(bot, [{action: CardActionEnum.Stop}, {color: leadingCard.color}])) {
        GameState.activeCard = matchedCard;
    }
    // else if (matchedCard = getCardInHand(bot, [{action: CardActionEnum.Plus}, {color: leadingCard.color}])) {
    //     GameState.activeCard = matchedCard;
    // }
    // if you have a taki card and it has the same color as the leading card - mark it as the active card.
    else if (matchedCard = getCardInHand(bot, [{action: CardActionEnum.Taki}, {color: leadingCard.color}])) {
        GameState.activeCard = matchedCard;
    }
    // if you have a card with the same color as the leading card - mark it as the active card.
    else if (matchedCard = getCardInHand(bot, [{color: leadingCard.color}])) {
        GameState.activeCard = matchedCard;
    }
    // if you have a card with the same number as the leading card - mark it as the active card.
    else if ( ( leadingCard.number !== null) && (matchedCard = getCardInHand(bot, [{number: leadingCard.number}])) ) {
        GameState.activeCard = matchedCard;
    }
    // if none of the conditions above happen - mark the top card of the draw pile as the active card.
    else {
        GameState.activeCard = GameState.drawPile.getTop();
    }
    playMove();
}

function restockDrawPile() {
    var wasRestocked;

    while (GameState.discardPile.cards.length > 1) {
        moveCard(GameState.discardPile.cards[0], GameState.discardPile, GameState.drawPile);
        wasRestocked = true;
    }
    if (wasRestocked) {
        shuffleArray(GameState.drawPile.cards);
    }
}

function hasCurrentPlayerWon() {
    return GameState.currentPlayer.hand.cards.length === 0;
}

function declareWinner() {
    alert(GameState.currentPlayer + ' is the winner !!!!!');
}

// gives option to leave the game or start a new one
function endGame() {
    var wantNewGame;
    clearObject(GameState);
    // asks if wants a new game
    if (wantNewGame) {
        initGame();
    }
}

function requestColor(card) {
    loadPopUp('.choose-color-popup');

    // do i need to stop the function here so it will have to wait for an answer

}

function clearObject(object) {
    var key;
    for (key in object) {
        key = undefined;
    }
}

function change2Color(color) {
    var card = GameState.leadingCard;
    card.color = color;
    var cardElement = card.element.firstChild.firstChild;
    cardElement.setAttribute('style', 'color: ' + color);
    if (GameState.currentPlayer === GameState.players.human) {
        dropPopUp('.choose-color-popup');
        var shouldSwitchPlayers=true;
        endTurn(shouldSwitchPlayers);
    }
}

function changeCardColor(playerCard, chosenColor) {

    chosenColor !== 'Black' ? playerCard.color = chosenColor : playerCard.color = null;
    var cardElement = $('#card-' + playerCard.id);
    //cardElement.style.color = chosenColor;
    cardElement.setAttribute('style', 'color:' + chosenColor);
    //change color for frontCard and below
    // var tmpElement = cardElement.firstElementChild.lastElementChild;
    // tmpElement.style.color = chosenColor;
}

function availableMoveExist() {
    var legalCards = [];
    GameState.currentPlayer.hand.cards.forEach(function (card, index) {
        if (isMoveLegal(card)) {
            legalCards.push(index);
        }
    });
    return (legalCards.length > 0);
}

function doesHandHaveSameColorCards() {
    var handHaveSameColor = false;
    GameState.currentPlayer.hand.cards.forEach(function (handCard) {
        if (handCard.color === GameState.activeCard.color)
            handHaveSameColor = true;
    });
    return handHaveSameColor;
}

function displayCurrentPlayerNameDOM() {
    var currentPlayerDisplayElement = $('.current-player');
    currentPlayerDisplayElement.textContent = GameState.currentPlayer.name;
}

// ==>

function declareWinner() {
    loadPopUp('.winner-popup');
    displayStatsDOM(false);
}

function declareTechnicalWinner() {
    loadPopUp('.technical-winner-popup');
    displayStatsDOM(true);
}

function displayStatsDOM(isTechnical) {
    var stats = {
        turnCount: GameState.turnNumber,
        gameTime: getTimeDisplay(GameState.time.minutes.value) + ':' + getTimeDisplay(GameState.time.seconds.value),
        averageTime: getTimeDisplay(GameState.stats.averageMoveTime.minutes) + ':' + getTimeDisplay(GameState.stats.averageMoveTime.seconds),
        singleCardCount: GameState.currentPlayer.singleCardCounter
    };
    var container = createElement('div', null, ['stats']);
    for (var stat in stats) {
        var record = createElement('div', null, ['stat']);
        record.appendChild(createElement('span', stat, ['label']));
        record.appendChild(createElement('span', stats[stat].toString(), ['value']));
        container.appendChild(record);
    }
    var element = isTechnical ? $('.technical-winner-popup').querySelector('.stats-placeholder') : $('.winner-popup').querySelector('.stats-placeholder');
    element.appendChild(container);
}

function startNewGame() {
    dropAllPopUp();
    if (GameState) {
        clearObject(GameState);
    }
    removeElementsOnDOM();
    dropAllPopUp();
    initGame();
}

function removeCardElementsOnDOM() {
    var element;
    while ((element = GameState.drawPile) && element.element.children.length > 0) {
        element.element.removeChild(element.element.lastElementChild);
    }
    while ((element = GameState.discardPile) && element.element.children.length > 0) {
        element.element.removeChild(element.element.lastElementChild);
    }
    while ((element = GameState.players) && element.bot.hand.element.children.length > 0) {
        element.bot.hand.element.removeChild(element.bot.hand.element.lastElementChild);
    }
    while ((element = GameState.players) && element.human.hand.element.children.length > 0) {
        element.human.hand.element.removeChild(element.human.hand.element.lastElementChild);
    }
}

function removeConsoleElementsOnDOM() {
    var element;
    while ((element = $('.console')) && element.children.length > 0) {
        element.removeChild(element.lastElementChild);
    }

}

function removeStatisticsOnDOM() {
    var elements = document.querySelectorAll('.stats-placeholder');
    elements.forEach(function (element) {
        while (element && element.children.length > 0) {
            element.removeChild(element.lastElementChild);
        }
    });
}

function removeElementsOnDOM() {
    removeCardElementsOnDOM();
    removeConsoleElementsOnDOM();
    removeStatisticsOnDOM();
}

function exitGame() {
    disableElement('.overlay');
    var element = $('body');
    while (element.children.length > 0) {
        element.removeChild(element.lastChild);
    }
    var endGameElement = createElement('div', 'Game ended', null, null);
    element.appendChild(endGameElement);
}


// gives option to leave the game or start a new one
function endGame() {
    loadPopUp('.end-game-popup');
}

function loadPopUp(popUpSelector) {
    enableElement('.overlay');
    showElement(popUpSelector);
}

function dropPopUp(popUpSelector) {
    disableElement('.overlay');
    hideElement(popUpSelector);
}

function dropAllPopUp() {
    dropPopUp('.welcome-popup');
    dropPopUp('.choose-color-popup');
    dropPopUp('.end-game-popup');
    dropPopUp('.winner-popup');
    dropPopUp('.technical-winner-popup');
}

// ±±±±± Statistics ±±±±±

function updateStatistics() {
    updateAverageMoveTime();
    startClock(GameState.turnTime);
    displayCurrentPlayerNameDOM();
    updateNumberOfTurns();
}

function displayCurrentPlayerNameDOM() {
    GameState.navbar.currentPlayer.textContent = GameState.currentPlayer.name;
}

function updateNumberOfTurns() {
    GameState.turnNumber++;
    GameState.navbar.turnNumber.textContent = GameState.turnNumber;
}

function initStatistics() {
    GameState.navbar.currentPlayer.textContent = 'Dealer';
    GameState.turnNumber = '0';
//    GameState.navbar.turnNumber.textContent = '0';
    GameState.stats.totalMoveTime.minutes = 0;
    GameState.stats.totalMoveTime.seconds = 0;
}