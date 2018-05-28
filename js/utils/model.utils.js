function swap(x, y, arr) {
    var tmp = arr[y];
    arr[y] = arr[x];
    arr[x] = tmp;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function shuffleArray(arr) {
    var i, j;
    var length = arr.length - 1;
    for (i = 0; i < length; i++) {
        j = getRandomInt(0, length);
        swap(i, j, arr);
    }
}

function move(index, sourceArray, destinationArray, isInsertAsFirst) {
    if (!isInsertAsFirst) {
        isInsertAsFirst = false;
    }
    var item = sourceArray.splice(index, 1);
    if (isInsertAsFirst) {
        destinationArray.unshift(item[0]);
    } else if (isInsertAsFirst === false) {
        destinationArray.push(item[0]);
    }
}

/*
function move(index, sourceArray, destinationArray) {
    var item = sourceArray.splice(index, 1);
    destinationArray.push(item[0]);
}
*/


function showTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    return (h + ":" + m + ":" + s);

    function checkTime(i) {
        if (i < 10) {
            i = "0" + i
        }  // add zero in front of numbers < 10
        return i;
    }
}

//helping function - TODO: can be deleted later
function getCardById(id) {
    var tmpCard = GameState.drawPile.cards.find(function (card) {
        return card.id === id;
    });
    if (tmpCard !== undefined) {
        return tmpCard;
    }
    tmpCard = GameState.discardPile.cards.find(function (card) {
        return card.id === id;
    });
    if (tmpCard !== undefined) return tmpCard;
    tmpCard = GameState.players.bot.hand.cards.find(function (card) {
        return card.id === id;
    });
    if (tmpCard !== undefined) return tmpCard;
    tmpCard = GameState.players.human.hand.cards.find(function (card) {
        return card.id === id;
    });
    if (tmpCard !== undefined) return tmpCard;
}


function getFirstItemByMatchConditions(arr, conditionList) {
    return arr.find(function (item) {
        return conditionList.reduce(function (accumulator, condition) {
            var key = getKey(condition, 0);
            var value = condition[key];
            return accumulator && item[key] === value;
        }, true);
    });
}

function getKey(obj, index) {
    return Object.keys(obj)[index]
}
