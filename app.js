function getList() {
    let url = 'https://jsonplaceholder.typicode.com/posts';
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        if (xhr.status !== 200) {
            console.log(xhr.status + ': ' + xhr.statusText);
        } else {
            let data = JSON.parse(xhr.responseText);
            let dataContainer = document.createElement('ul');
            dataContainer.setAttribute("id", 'data-container');
            document.body.appendChild(dataContainer);
            data.forEach(function (item) {
                dataContainer.insertAdjacentHTML('afterBegin', "<li>" + item.title + "</li>");
            });
            changePosition();
        }
    };
    xhr.send();
}

getList();

function setHover(el) {
    if (el.classList !== null) {
        el.classList.add('hovered');
    }
}

function removeHover(all, hovered) {
    all.forEach(function (item) {
        if (item !== hovered) item.classList.remove('hovered');
    });
}

function insertAfter(newNode, referenceNode) {
    newNode.classList.add('new');
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function insertBefore(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode);
}

function changePosition() {
    let selectedItem,
        clone,
        items = document.querySelectorAll('#data-container li'),
        cursorPosition = {},
        hoveredItem;


    items.forEach(function (item) {
        item.addEventListener('mousedown', function (e) {
            e.preventDefault();
            selectedItem = e.target;
            clone = selectedItem.cloneNode(true);
            clone.style.opacity = .5;
            clone.classList.add('clone');
            document.getElementById('data-container').appendChild(clone);
        }, false);

        item.addEventListener('mousemove', function (e) {
            if (clone) {
                cursorPosition.left = e.clientX;
                cursorPosition.top = e.pageY;
                clone.style.cssText = `
                    left:  ${e.clientX}px;
                    top: ${e.pageY + 25}px;
                `;
            }
        }, false);

        item.addEventListener('mouseover', function (e) {
            if (clone) {
                if (e.clientY < 60) {
                    insertBefore(selectedItem, document.elementFromPoint(e.clientX, e.clientY))
                }
                insertAfter(selectedItem, document.elementFromPoint(e.clientX, e.clientY));
            }
        });

        item.addEventListener('mouseup', function (e) {
            if (clone) {
                document.getElementById('data-container').removeChild(clone);
                item.classList.remove('new');
                clone = undefined;
            }
        }, false);

        item.addEventListener('touchstart', function (e) {
            e.preventDefault();
            selectedItem = e.target;
            clone = selectedItem.cloneNode(true);
            clone.style.opacity = .5;
            clone.classList.add('clone');
            document.getElementById('data-container').appendChild(clone);
        }, false);

        item.addEventListener('touchmove', function (e) {
            if (clone) {
                cursorPosition.left = e.touches[0].clientX;
                cursorPosition.top = e.touches[0].clientY;
                hoveredItem = document.elementFromPoint(cursorPosition.left, cursorPosition.top);
                if (cursorPosition.top < 60) {
                    insertBefore(selectedItem, hoveredItem)
                } else {
                    insertAfter(selectedItem, hoveredItem);
                }
                clone.style.cssText = `
                    left:  ${e.touches[0].clientX}px;
                    top: ${e.touches[0].pageY + 25}px;
                `;
            }
        }, false);

        item.addEventListener('touchend', function () {
            item.classList.remove('new');
            document.getElementById('data-container').removeChild(clone);
            clone = undefined;
        }, false)
    });
}