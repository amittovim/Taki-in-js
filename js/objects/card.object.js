function Card(id, container, color, number, action, isHidden, element) {
    this.id = id;
    this.container = container;
    this.color = color;
    this.number = number || null;
    this.action = action || null;
    this.isHidden = isHidden || true;
    this.element = element;
}

Card.prototype.getDisplay = function () {
    if (this.action === CardActionEnum.ChangeColor) {
        return 'CC';
    } else {
        return this.action ? this.action : this.number;
    }
};

Card.prototype.getDescription = function () {
    if (this.action === CardActionEnum.ChangeColor) {
        return CardActionEnum.ChangeColor;
    }
    else if (this.action && this.color) {
        return (this.color + ' ' + this.action);
    }
    else if (this.number) {
        return (this.color + ' ' + this.number)
    }
};

Card.prototype.isActionCard = function () {
    return !!this.action;
};

Card.prototype.isSpecialCard = function () {
    return this.isActionCard() && (this.action === CardActionEnum.Taki ||
        this.action === CardActionEnum.Stop  /* || this.action === CardActionEnum.Plus*/  );
};

// TODO: difference between stop and plus

