function Player(name, element) {
    this.name = name;
    this.hand = {
        name: this.name + ' hand',
        cards: [],
        element: element
    };
    this.singleCardCounter = 0;
}
