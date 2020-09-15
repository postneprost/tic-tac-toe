const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');
let dimension = prompt('Введите размер поля', 3);
let fields;
let win;
let step;
let rowAI;
let colAI;

startGame();
addResetListener();

function startGame () {
    win = false;
    step = 0;
    fields = [];
    for (let i = 0; i < dimension; i++) {
        fields[i] = [];
        for (let j = 0; j < dimension; j++) {
            fields[i][j] = EMPTY;
        }
    }
    renderGrid(dimension);
}

function renderGrid (dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function cellClickHandler (row, col) {
    if (fields[row][col] != EMPTY) return;
    if (win) {
        renderSymbolInCell(EMPTY, row, col);
        return;
    }
    fields[row][col] = CROSS;
    renderSymbolInCell(CROSS, row, col);
    
    
    if (determineWinner(fields, row, col, CROSS)) {
        win = true;
        return;
    }    
    if (fields.every(fieldsRow => 
        (fieldsRow.every(fieldsCol => 
            (fieldsCol != EMPTY))))) alert('Победила дружба');
    
    artificialIntelligence(fields);
    
    
    
    console.log(`Clicked on cell: ${row}, ${col}`);
}




function artificialIntelligence(fields) {
    
    if (step == 0) {
        rowAI = getRandom();
        colAI = 0;
    }
    
    if (fields[rowAI][colAI] != EMPTY) {
        step = 0;
        artificialIntelligence(fields);
    }

    let horizontal = true;

    for (let k = 0; k < dimension; k++) {
        if (fields[rowAI][k] == CROSS) horizontal = false;
    }
    
    if (horizontal) {
        fields[rowAI][colAI] = ZERO;
        renderSymbolInCell(ZERO, rowAI, colAI);
        
        if (determineWinner(fields, rowAI, colAI, ZERO)) {
            win = true;
            return;
        }

        step++;
        colAI++;
        return;
    } else {
        step = 0;
        artificialIntelligence(fields);
        return;
    }
}

function getRandom() {
    return Math.floor(Math.random() * dimension);
}

function determineWinner(fields, row, col, elem) {
    let result = elem == CROSS ? 'Победили крестики' : 'Победили нолики';
    let horizontalWin = true;
    let verticalWin = true;
    let diagonalWin1 = true;
    let diagonalWin2 = true;
    for (let i = 0; i < dimension; i++) {
        if (fields[row][i] != elem) horizontalWin = false;
        if (fields[i][col] != elem) verticalWin = false;
        if (fields[i][i] != elem) diagonalWin1 = false;
        if (fields[i][dimension - i - 1] != elem) diagonalWin2 = false;
    }
    if (horizontalWin) {
        paintHorizontalWinner(row);
        alert(result);
        return true;
    }
    if (verticalWin) {
        paintVerticalWinner(col);
        alert(result);
        return true;
    }
    if (diagonalWin1) {
        paintDiagonalWinner1();
        alert(result);
        return true;
    }
    if (diagonalWin2) {
        paintDiagonalWinner2();
        alert(result);
        return true;
    }
    return false;
}

function paintHorizontalWinner(row) {
    for (let i = 0; i < dimension; i++) {
        container.querySelectorAll('tr')[row].querySelectorAll('td')[i].style.color = 'red';
    }
}

function paintVerticalWinner(col) {
    for (let i = 0; i < dimension; i++) {
        container.querySelectorAll('tr')[i].querySelectorAll('td')[col].style.color = 'red';
    }
}

function paintDiagonalWinner1() {
    for (let i = 0; i < dimension; i++) {
        container.querySelectorAll('tr')[i].querySelectorAll('td')[i].style.color = 'red';
    }
}

function paintDiagonalWinner2() {
    for (let i = 0; i < dimension; i++) {
        container.querySelectorAll('tr')[i].querySelectorAll('td')[dimension - i - 1].style.color = 'red';
    }
}

function renderSymbolInCell (symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);
    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell (row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener () {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler () {
    startGame();
    console.log('reset!');
}


/* Test Function */
/* Победа первого игрока */
function testWin () {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw () {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell (row, col) {
    findCell(row, col).click();
}
