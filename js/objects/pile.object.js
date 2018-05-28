function Pile(cards, element, name) {
    this.cards = cards;
    this.element = element;
    this.name = name;
}

Pile.prototype.getTop = function () {
    return this.cards[this.cards.length - 1];
};

Pile.prototype.getCardById = function (id) {
    return this.cards.find(function (card) {
        return card.id === id;
    })
};