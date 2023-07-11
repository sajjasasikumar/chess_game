const gameboard = document.querySelector('#gameboard')
const playerDisplay = document.querySelector('#player')
const infoDisplay = document.querySelector('#info-display')
const width = 8;
const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook,
]

let playerGo = 'black'
let prev = 'white';
playerDisplay.textContent = 'black'
const encourage = {
    0 : "great move!!",
    1 : "amazing!!",
    2 : "keep going!!",
    3 : "wonderful!!",
    4 : "extra ordinary!!"
}


function createboard() {
    // for every element in the startPieces, we run a loop by passing the startpiece and a counter
    startPieces.forEach((startPiece, i) => {
        // creating a div with a name square
        const square = document.createElement('div')
        //  adding a class to the square
        square.classList.add('square')
        // setting innerHTML of the div to startPieces which are having some svg tag in it
        square.innerHTML = startPiece
        // setting the squares having firstchild as draggable
        square.firstChild?.setAttribute('draggable', true)
        // setting id as the counter itself. so the id starts with 0
        square.setAttribute('square-id', i)
        // getting the row number to which the particular square belong to
        const row = Math.floor((63 - i) / 8) + 1
        // checking if the row is even or odd
        if (row % 2 === 0)
            square.classList.add(i % 2 === 0 ? "beige" : "brown")
        else
            square.classList.add(i % 2 === 0 ? "brown" : "beige")

        if (i <= 15) {
            square.firstChild.firstChild.classList.add('black')
        }

        if (i >= 48) {
            square.firstChild.firstChild.classList.add('white')
        }

        gameboard.append(square)
    })
}

createboard();

let startPositionId;        // stores the selected piece id
let draggedElement;         // stores the selected piece

// stores all the squares
const allSquares = document.querySelectorAll(".square")
allSquares.forEach(square => {
    // dragstart is used to drag the element
    square.addEventListener('dragstart', dragStart)
    // dragover is used to know over which elements our selected element is being dragged
    square.addEventListener('dragover', dragOver)
    // drop is used to drop the selected element in a particular element
    square.addEventListener('drop', dragDrop)
})

function dragStart(e) {
    // e is the event and 
    // console.log(e.target)
    // gets the id of the parent in which the image is present
    startPositionId = e.target.parentNode.getAttribute('square-id')
    // stores the div of image
    draggedElement = e.target

}

function dragOver(e) {
    // prevents the default action
    e.preventDefault()
}

function dragDrop(e) {
    // The stopPropagation() method prevents propagation of the same event from being called.
    // Propagation means bubbling up to parent elements or capturing down to child elements.
    e.stopPropagation()
    // console.log(draggedElement)
    // console.log(e.target)
    // class list is a read-only property that is used to return CSS classes in the form of an array 

    // correctGo tells whether the player could choose that square in his move or not, to choose that square to drag, the square should contain the color of the piece
    const correctGo = draggedElement.firstChild.classList.contains(playerGo)
    // taken tells whether the target place contains any piece or not
    const taken = e.target.classList.contains('piece')
    // checks the validity of the move
    const valid = checkifValid(e.target)
    // sets the opponent turn
    const opponentGo = playerGo === 'white' ? 'black' : 'white'
    // takenbyOpponent first checks whether the target square has any image in it. if present, then it will check whether it contains any opponentGo
    const takenbyOpponent = e.target.firstChild?.classList.contains(opponentGo)

    // console.log('playerGo',playerGo)
    // console.log('opponentGo',opponentGo)
    // console.log('draggedElement',draggedElement)
    console.log(e.target)

    if (correctGo) {
        if (takenbyOpponent && valid) {
            e.target.parentNode.append(draggedElement)
            e.target.remove()
            let enc = parseInt(Math.random() * 4);
            infoDisplay.textContent = encourage[enc];
            checkForWin()
            changePlayer()
            return
        }
    }
    if (taken && !takenbyOpponent) {
        infoDisplay.textContent = "invalid move"
        setTimeout(() => infoDisplay.textContent = "", 2000)
        return
    }
    console.log(valid)
    if (valid) {
        console.log(prev)
    console.log(playerGo)
    if((prev=="white"&&draggedElement.firstChild.classList.contains("white")) || (prev=="black"&&draggedElement.firstChild.classList.contains("black")))
    {
        infoDisplay.textContent = "it's not your turn";
        setTimeout(() => infoDisplay.textContent = "", 2000)
        return
    }
        e.target.append(draggedElement)
        // console.log(e.target)
        let enc = parseInt(Math.random() * 4);
        infoDisplay.textContent = encourage[enc];
        setTimeout(() => infoDisplay.textContent = "", 2000)
        checkForWin()
        changePlayer()
        return
    }
    else
    {
        infoDisplay.textContent = "invalid move"
        setTimeout(() => infoDisplay.textContent = "", 2000)
        return;
    }
}


function checkifValid(target) {
    // console.log(target)
    
    const targetID = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'))
    const startID = Number(startPositionId);
    const piece = draggedElement.id
    console.log('startID', startID)
    console.log('targetID', targetID)
    console.log('piece', piece)
    // console.log(target)

    switch (piece) {
        case 'pawn':
            const startRow = [8, 9, 10, 11, 12, 13, 14, 15]
            if (startRow.includes(startID) && startID + width * 2 === targetID ||
                startID + width === targetID ||
                startID + width - 1 === targetID && document.querySelector(`[square-id = "${startID + width - 1}"]`).firstChild ||
                startID + width + 1 === targetID && document.querySelector(`[square-id = "${startID + width + 1}"]`).firstChild)
                return true;
            break;
        case 'knight':
            if (startID + width * 2 - 1 === targetID || startID + width * 2 + 1 === targetID || startID + width - 2 === targetID || startID + width + 2 === targetID || startID - width * 2 - 1 === targetID || startID - width * 2 + 1 === targetID || startID - width - 2 === targetID || startID - width + 2 === targetID)
                return true;
            break; 
        case 'bishop':
            if (startID + width + 1 === targetID ||

                startID + width * 2 + 2 === targetID && !document.querySelector(`[square-id="${startID + width + 1}"]`).firstChild ||

                startID + width * 3 + 3 === targetID && !document.querySelector(`[square-id="${startID + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2 + 2}"]`).firstChild ||

                startID + width * 4 + 4 === targetID && !document.querySelector(`[square-id="${startID + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 3 + 3}"]`).firstChild ||

                startID + width * 5 + 5 === targetID && !document.querySelector(`[square-id="${startID + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 4 + 4}"]`).firstChild ||

                startID + width * 6 + 6 === targetID && !document.querySelector(`[square-id="${startID + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 5 + 5}"]`).firstChild ||

                startID + width * 7 + 7 === targetID && !document.querySelector(`[square-id="${startID + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 6 + 6}"]`).firstChild ||

                startID - width - 1 === targetID ||

                startID - width * 2 - 2 === targetID && !document.querySelector(`[square-id="${startID - width - 1}"]`).firstChild ||

                startID - width * 3 - 3 === targetID && !document.querySelector(`[square-id="${startID - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2 - 2}"]`).firstChild ||

                startID - width * 4 - 4 === targetID && !document.querySelector(`[square-id="${startID - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${starID - width * 3 - 3}"]`).firstChild ||

                startID - width * 5 - 5 === targetID && !document.querySelector(`[square-id="${startID - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 4 - 4}"]`).firstChild ||

                startID - width * 6 - 6 === targetID && !document.querySelector(`[square-id="${startID - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 5 - 5}"]`).firstChild ||

                startID - width * 7 - 7 === targetID && !document.querySelector(`[square-id="${startID - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 6 - 6}"]`).firstChild ||

                startID - width + 1 === targetID ||

                startID - width * 2 + 2 === targetID && !document.querySelector(`[square-id="${startID - width + 1}"]`).firstChild ||

                startID - width * 3 + 3 === targetID && !document.querySelector(`[square-id="${startID - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2 + 2}"]`).firstChild ||

                startID - width * 4 + 4 === targetID && !document.querySelector(`[square-id="${startID - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 3 + 3}"]`).firstChild ||

                startID - width * 5 + 5 === targetID && !document.querySelector(`[square-id="${startID - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 4 + 4}"]`).firstChild ||

                startID - width * 6 + 6 === targetID && !document.querySelector(`[square-id="${startID - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 5 + 5}"]`).firstChild ||

                startID - width * 7 + 7 === targetID && !document.querySelector(`[square-id="${startID - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 6 + 6}"]`).firstChild ||

                startID + width - 1 === targetID ||

                startID + width * 2 - 2 === targetID && !document.querySelector(`[square-id="${startID + width - 1}"]`).firstChild ||

                startID + width * 3 - 3 === targetID && !document.querySelector(`[square-id="${startID + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2 - 2}"]`).firstChild ||

                startID + width * 4 - 4 === targetID && !document.querySelector(`[square-id="${startID + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 3 - 3}"]`).firstChild ||

                startID + width * 5 - 5 === targetID && !document.querySelector(`[square-id="${startID + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 4 - 4}"]`).firstChild ||

                startID + width * 6 - 6 === targetID && !document.querySelector(`[square-id="${startID + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 5 - 5}"]`).firstChild ||

                startID + width * 7 - 7 === targetID && !document.querySelector(`[square-id="${startID + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 6 - 6}"]`).firstChild) {
                return true;
            }
            break;
        case 'rook':
            if (
                // set 1
                startID + width === targetID ||

                startID + width * 2 == targetID && !document.querySelector(`[square-id="${startID + width}"]`).firstChild ||

                startID + width * 3 == targetID && !document.querySelector(`[square-id="${startID + width}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2}"]`).firstChild ||

                startID + width * 4 == targetID && !document.querySelector(`[square-id="${startID + width}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 3}"]`).firstChild ||

                startID + width * 5 == targetID && !document.querySelector(`[square-id="${startID + width}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 4}"]`).firstChild ||

                startID + width * 6 == targetID && !document.querySelector(`[square-id="${startID + width}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 4}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 5}"]`).firstChild ||

                startID + width * 7 == targetID && !document.querySelector(`[square-id="${startID + width}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 4}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 5}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 6}"]`).firstChild ||

                // set 2
                startID - width === targetID ||

                startID - width * 2 == targetID && !document.querySelector(`[square-id="${startID - width}"]`).firstChild ||

                startID - width * 3 == targetID && !document.querySelector(`[square-id="${startID - width}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2}"]`).firstChild ||

                startID - width * 4 == targetID && !document.querySelector(`[square-id="${startID - width}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 3}"]`).firstChild ||

                startID - width * 5 == targetID && !document.querySelector(`[square-id="${startID - width}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 4}"]`).firstChild ||

                startID - width * 6 == targetID && !document.querySelector(`[square-id="${startID - width}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 4}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 5}"]`).firstChild ||

                startID - width * 7 == targetID && !document.querySelector(`[square-id="${startID - width}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 4}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 5}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 6}"]`).firstChild ||

                // set 
                startID - 1 === targetID ||

                startID - 2 == targetID && !document.querySelector(`[square-id="${startID - 1}"]`).firstChild ||

                startID - 3 == targetID && !document.querySelector(`[square-id="${startID - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - 2}"]`).firstChild ||

                startID - 4 == targetID && !document.querySelector(`[square-id="${startID - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - 3}"]`).firstChild ||

                startID - 5 == targetID && !document.querySelector(`[square-id="${startID - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - 3}"]`).firstChild && !document.querySelector(`[square-id="${startID - 4}"]`).firstChild ||

                startID - 6 == targetID && !document.querySelector(`[square-id="${startID - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - 3}"]`).firstChild && !document.querySelector(`[square-id="${startID - 4}"]`).firstChild && !document.querySelector(`[square-id="${startID - 5}"]`).firstChild ||

                startID - 7 == targetID && !document.querySelector(`[square-id="${startID - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - 3}"]`).firstChild && !document.querySelector(`[square-id="${startID - 4}"]`).firstChild && !document.querySelector(`[square-id="${startID - 5}"]`).firstChild && !document.querySelector(`[square-id="${startID - 6}"]`).firstChild ||

                // set 4
                startID + 1 === targetID ||

                startID + 2 == targetID && !document.querySelector(`[square-id="${startID + 1}"]`).firstChild ||

                startID + 3 == targetID && !document.querySelector(`[square-id="${startID + 1}"]`).firstChild && !document.querySelector(`[square-id="${startID + 2}"]`).firstChild ||

                startID + 4 == targetID && !document.querySelector(`[square-id="${startID + 1}"]`).firstChild && !document.querySelector(`[square-id="${startID + 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + 3}"]`).firstChild ||

                startID + 5 == targetID && !document.querySelector(`[square-id="${startID + 1}"]`).firstChild && !document.querySelector(`[square-id="${startID + 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + 3}"]`).firstChild && !document.querySelector(`[square-id="${startID + 4}"]`).firstChild ||

                startID + 6 == targetID && !document.querySelector(`[square-id="${startID + 1}"]`).firstChild && !document.querySelector(`[square-id="${startID + 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + 3}"]`).firstChild && !document.querySelector(`[square-id="${startID + 4}"]`).firstChild && !document.querySelector(`[square-id="${startID + 5}"]`).firstChild ||

                startID + 7 == targetID && !document.querySelector(`[square-id="${startID + 1}"]`).firstChild && !document.querySelector(`[square-id="${startID + 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + 3}"]`).firstChild && !document.querySelector(`[square-id="${startID + 4}"]`).firstChild && !document.querySelector(`[square-id="${startID + 5}"]`).firstChild && !document.querySelector(`[square-id="${startID + 6}"]`).firstChild
            )
                return true;
                break;
        case 'queen' :
            if(
                startID + width + 1 === targetID ||

                startID + width * 2 + 2 === targetID && !document.querySelector(`[square-id="${startID + width + 1}"]`).firstChild ||

                startID + width * 3 + 3 === targetID && !document.querySelector(`[square-id="${startID + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2 + 2}"]`).firstChild ||

                startID + width * 4 + 4 === targetID && !document.querySelector(`[square-id="${startID + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 3 + 3}"]`).firstChild ||

                startID + width * 5 + 5 === targetID && !document.querySelector(`[square-id="${startID + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 4 + 4}"]`).firstChild ||

                startID + width * 6 + 6 === targetID && !document.querySelector(`[square-id="${startID + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 5 + 5}"]`).firstChild ||

                startID + width * 7 + 7 === targetID && !document.querySelector(`[square-id="${startID + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 6 + 6}"]`).firstChild ||

                startID - width - 1 === targetID ||

                startID - width * 2 - 2 === targetID && !document.querySelector(`[square-id="${startID - width - 1}"]`).firstChild ||

                startID - width * 3 - 3 === targetID && !document.querySelector(`[square-id="${startID - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2 - 2}"]`).firstChild ||

                startID - width * 4 - 4 === targetID && !document.querySelector(`[square-id="${startID - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 3 - 3}"]`).firstChild ||

                startID - width * 5 - 5 === targetID && !document.querySelector(`[square-id="${startID - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 4 - 4}"]`).firstChild ||

                startID - width * 6 - 6 === targetID && !document.querySelector(`[square-id="${startID - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 5 - 5}"]`).firstChild ||

                startID - width * 7 - 7 === targetID && !document.querySelector(`[square-id="${startID - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 6 - 6}"]`).firstChild ||

                startID - width + 1 === targetID ||

                startID - width * 2 + 2 === targetID && !document.querySelector(`[square-id="${startID - width + 1}"]`).firstChild ||

                startID - width * 3 + 3 === targetID && !document.querySelector(`[square-id="${startID - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2 + 2}"]`).firstChild ||

                startID - width * 4 + 4 === targetID && !document.querySelector(`[square-id="${startID - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 3 + 3}"]`).firstChild ||

                startID - width * 5 + 5 === targetID && !document.querySelector(`[square-id="${startID - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 4 + 4}"]`).firstChild ||

                startID - width * 6 + 6 === targetID && !document.querySelector(`[square-id="${startID - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 5 + 5}"]`).firstChild ||

                startID - width * 7 + 7 === targetID && !document.querySelector(`[square-id="${startID - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 6 + 6}"]`).firstChild ||

                startID + width - 1 === targetID ||

                startID + width * 2 - 2 === targetID && !document.querySelector(`[square-id="${startID + width - 1}"]`).firstChild ||

                startID + width * 3 - 3 === targetID && !document.querySelector(`[square-id="${startID + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2 - 2}"]`).firstChild ||

                startID + width * 4 - 4 === targetID && !document.querySelector(`[square-id="${startID + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 3 - 3}"]`).firstChild ||

                startID + width * 5 - 5 === targetID && !document.querySelector(`[square-id="${startID + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 4 - 4}"]`).firstChild ||

                startID + width * 6 - 6 === targetID && !document.querySelector(`[square-id="${startID + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 5 - 5}"]`).firstChild ||

                startID + width * 7 - 7 === targetID && !document.querySelector(`[square-id="${startID + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 6 - 6}"]`).firstChild ||


                // set 1
                startID + width === targetID ||

                startID + width * 2 == targetID && !document.querySelector(`[square-id="${startID + width}"]`).firstChild ||

                startID + width * 3 == targetID && !document.querySelector(`[square-id="${startID + width}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2}"]`).firstChild ||

                startID + width * 4 == targetID && !document.querySelector(`[square-id="${startID + width}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 3}"]`).firstChild ||

                startID + width * 5 == targetID && !document.querySelector(`[square-id="${startID + width}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 4}"]`).firstChild ||

                startID + width * 6 == targetID && !document.querySelector(`[square-id="${startID + width}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 4}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 5}"]`).firstChild ||

                startID + width * 7 == targetID && !document.querySelector(`[square-id="${startID + width}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 4}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 5}"]`).firstChild && !document.querySelector(`[square-id="${startID + width * 6}"]`).firstChild ||

                // set 2
                startID - width === targetID ||

                startID - width * 2 == targetID && !document.querySelector(`[square-id="${startID - width}"]`).firstChild ||

                startID - width * 3 == targetID && !document.querySelector(`[square-id="${startID - width}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2}"]`).firstChild ||

                startID - width * 4 == targetID && !document.querySelector(`[square-id="${startID - width}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 3}"]`).firstChild ||

                startID - width * 5 == targetID && !document.querySelector(`[square-id="${startID - width}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 4}"]`).firstChild ||

                startID - width * 6 == targetID && !document.querySelector(`[square-id="${startID - width}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 4}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 5}"]`).firstChild ||

                startID - width * 7 == targetID && !document.querySelector(`[square-id="${startID - width}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 4}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 5}"]`).firstChild && !document.querySelector(`[square-id="${startID - width * 6}"]`).firstChild ||

                // set 3
                startID - 1 === targetID ||

                startID - 2 == targetID && !document.querySelector(`[square-id="${startID - 1}"]`).firstChild ||

                startID - 3 == targetID && !document.querySelector(`[square-id="${startID - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - 2}"]`).firstChild ||

                startID - 4 == targetID && !document.querySelector(`[square-id="${startID - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - 3}"]`).firstChild ||

                startID - 5 == targetID && !document.querySelector(`[square-id="${startID - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - 3}"]`).firstChild && !document.querySelector(`[square-id="${startID - 4}"]`).firstChild ||

                startID - 6 == targetID && !document.querySelector(`[square-id="${startID - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - 3}"]`).firstChild && !document.querySelector(`[square-id="${startID - 4}"]`).firstChild && !document.querySelector(`[square-id="${startID - 5}"]`).firstChild ||

                startID - 7 == targetID && !document.querySelector(`[square-id="${startID - 1}"]`).firstChild && !document.querySelector(`[square-id="${startID - 2}"]`).firstChild && !document.querySelector(`[square-id="${startID - 3}"]`).firstChild && !document.querySelector(`[square-id="${startID - 4}"]`).firstChild && !document.querySelector(`[square-id=="${startID - 5}"]`).firstChild && !document.querySelector(`[square-id="${startID - 6}"]`).firstChild ||

                // set 4
                startID + 1 === targetID ||

                startID + 2 == targetID && !document.querySelector(`[square-id="${startID + 1}"]`).firstChild ||

                startID + 3 == targetID && !document.querySelector(`[square-id="${startID + 1}"]`).firstChild && !document.querySelector(`[square-id="${startID + 2}"]`).firstChild ||

                startID + 4 == targetID && !document.querySelector(`[square-id="${startID + 1}"]`).firstChild && !document.querySelector(`[square-id="${startID + 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + 3}"]`).firstChild ||

                startID + 5 == targetID && !document.querySelector(`[square-id="${startID + 1}"]`).firstChild && !document.querySelector(`[square-id="${startID + 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + 3}"]`).firstChild && !document.querySelector(`[square-id="${startID + 4}"]`).firstChild ||

                startID + 6 == targetID && !document.querySelector(`[square-id="${startID + 1}"]`).firstChild && !document.querySelector(`[square-id="${startID + 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + 3}"]`).firstChild && !document.querySelector(`[square-id="${startID + 4}"]`).firstChild && !document.querySelector(`[square-id="${startID + 5}"]`).firstChild ||

                startID + 7 == targetID && !document.querySelector(`[square-id="${startID + 1}"]`).firstChild && !document.querySelector(`[square-id==${startID + 2}"]`).firstChild && !document.querySelector(`[square-id="${startID + 3}"]`).firstChild && !document.querySelector(`[square-id="${startID + 4}"]`).firstChild && !document.querySelector(`[square-id="${startID + 5}"]`).firstChild && !document.querySelector(`[square-id="${startID + 6}"]`).firstChild

            )
            {
                return true;
            }
            break;
        case 'king' :
            if(
                startID+1===targetID || 
                startID-1==targetID || 
                startID + width === targetID || 
                startID - width === targetID ||
                startID + width +1 === targetID ||
                startID + width -1 === targetID ||
                startID - width +1 === targetID ||
                startID - width -1 === targetID
            )
            {
                return true;
            }
            break;
    }
}




function changePlayer() {
    if(prev==playerGo)
    {
        infoDisplay.textContent = "invalid move!it's "+prev+" turn";
        setTimeout(() => infoDisplay.textContent = "", 2000);
        return;    
    }
    else
    {
        prev = playerGo;
        if (playerGo == "black") {
            reverseIDs()
            playerGo = "white"
            playerDisplay.textContent = 'white'
        }
        else {
            revertIDs()
            playerGo = "black"
            playerDisplay.textContent = 'black'
        }
    }
    
}

function reverseIDs() {
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) =>
        square.setAttribute('square-id', (width * width - 1) - i))
}

function revertIDs() {
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) =>
        square.setAttribute('square-id', i))
}


function checkForWin(){
    const kings = Array.from(document.querySelectorAll('#king'))
    // console.log(kings)
    if(!kings.some(king=>king.firstChild.classList.contains('white')))
    {
        infoDisplay.innerHTML = "black player wins!!"
        const allSquares = document.querySelectorAll('.square')
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable',false))
    }
    if(!kings.some(king=>king.firstChild.classList.contains('black')))
    {
        infoDisplay.innerHTML = "white player wins!!"
        const allSquares = document.querySelectorAll('.square')
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable',false))
    }
}