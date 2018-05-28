function createElement(tagName, innerText, classArray, attributes) {
    var element = document.createElement(tagName);
    if (innerText) {
        var textNode = document.createTextNode(innerText);
        element.appendChild(textNode);
    }
    if (attributes) {
        attributes.forEach(function (attr) {
            element.setAttribute(attr.name, attr.value);
        });
    }
    if (classArray) {
        classArray.forEach(function (className) {
            element.classList.add(className)
        });
    }
    return element;
}

function disableElement(selector) {
    var element = $(selector);
    element.style.display = 'none';
}

function enableElement(selector) {
    var element = $(selector);
    element.style.display = 'block';
}

function hideElement(selector) {
    var element = document.querySelector(selector);
    element.style.visibility = 'hidden';
}

function showElement(selector) {
    var element = document.querySelector(selector);
    element.style.visibility = 'visible';
}

function $(selector) {
    return document.querySelector(selector);
}

function exchangeElements(element1, element2) {
    var clonedElement1 = element1.cloneNode(true);
    var clonedElement2 = element2.cloneNode(true);
    element2.parentNode.replaceChild(clonedElement1, element2);
    element1.parentNode.replaceChild(clonedElement2, element1);
}

function printLogOnDom(text) {
    var messageElement = createElement('div', showTime() + ' ' + GameState.currentPlayer.name + ': ' + text, null, null);
    var consoleElement = $('.console');
    if (consoleElement.children.length > 0)
        consoleElement.removeChild(consoleElement.lastElementChild);
    insertAsFirstChild(messageElement, consoleElement);
}

function insertAsFirstChild(newChildElement, parentElement) {
    var firstChild;
    if (firstChild = parentElement.firstElementChild) {
        parentElement.insertBefore(newChildElement, firstChild);
    } else {
        parentElement.appendChild(newChildElement);
    }
}

