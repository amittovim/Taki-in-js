function startClock(clock) {
    resetClock(clock);
    clock.interval = setInterval(moveTime, 1000, clock);
}

function resetClock(clock) {
    clock.seconds.value = 0;
    clock.seconds.element.textContent = '00';
    clock.minutes.value = 0;
    clock.minutes.element.textContent = '00';
    clearInterval(clock.interval);
}

function moveTime(clock) {
    clock.seconds.value++;
    clock.seconds.element.textContent = getTimeDisplay(clock.seconds.value);
    if (clock.seconds.value > 60) {
        clock.minutes.value++;
        clock.seconds.value = 0;
    }
    clock.minutes.element.textContent = getTimeDisplay(clock.minutes.value);
}

function getTimeDisplay(value) {
    value = parseInt(value);
    var display = '';
    if (value < 10) {
        display += '0';
    }
    display += value;
    return display;
}

function updateAverageMoveTime() {
    GameState.stats.totalMoveTime.minutes += GameState.turnTime.minutes.value;
    GameState.stats.totalMoveTime.seconds += GameState.turnTime.seconds.value;
    GameState.stats.averageMoveTime.minutes = GameState.stats.totalMoveTime.minutes / GameState.turnNumber;
    GameState.stats.averageMoveTime.seconds = GameState.stats.totalMoveTime.seconds / GameState.turnNumber;
}