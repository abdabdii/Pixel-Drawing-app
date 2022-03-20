let colorInput = document.getElementById("color")
let rowsInput = document.querySelector("#rows")
let colsInput = document.querySelector("#cols")
let cellInput = document.querySelector("#cell")
let color = colorInput.value
let state = []
let initialState = null
let isDrawing = false
const primaryColor = getComputedStyle(document.body).getPropertyValue('--primary-color')
const textColor = getComputedStyle(document.body).getPropertyValue('--text-color')

function isInt(str) {
    str = str.trim();
    if (!str) {
        return false;
    }
    str = str.replace(/^0+/, "") || "0";
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
}

function validate(value,maxValue=1000) {
    if (value <= maxValue && Number.isInteger(value)) {
        return value
    }

    return false
}

function undoState() { 
    const table =  document.getElementsByTagName("table")[0]
    table.innerHTML = ""
    let tableBody = null
    if (state.length >1){
        state.pop()
        tableBody = state[state.length-1].cloneNode(true)
        
    }else{
        state = []
        tableBody = initialState.cloneNode(true)
    }
    table.appendChild(tableBody)
}

function addEventsTbody(tableBody) {
    tableBody.addEventListener('mousedown' , handleMouseDown)
    tableBody.addEventListener('mouseover',handleMouseOver)
    tableBody.addEventListener('mouseup',handleMouseUp)
}

function createTable(numOfRows,numOfColumns,cellLength) {
    const tableBody = document.createElement("tbody")

    for (let row = 0; row < numOfRows; row++) {
        const tableRow = document.createElement("tr")

        for (let col = 0; col <numOfColumns; col++) {
            const cell = document.createElement("td");
            cell.style.width = `${cellLength}px`
            cell.style.height = `${cellLength}px`
            tableRow.appendChild(cell)
            
        }
        
        tableBody.appendChild(tableRow)
    }
    return tableBody
}

function drawTable() {
    const rows = rowsInput.value
    const cols = colsInput.value
    const cell = cellInput.value
    const isLessThanLimit = validate(cols*cell)
    if (isLessThanLimit) {
       const table =  document.getElementsByTagName("table")[0]
       table.innerHTML = ""
       const tbody = createTable(rows,cols,cell)
       table.appendChild(tbody)
       table.addEventListener('mousedown' , handleMouseDown)
       table.addEventListener('mouseover',handleMouseOver)
       table.addEventListener('mouseout',handleMouseLeave)
       table.addEventListener('mouseup',handleMouseUp)
       state = []
       const newState = tbody.cloneNode(true)
       initialState = newState
    }
}

function setBackground(e) {
    e.target.style.backgroundColor = color
}

function isCell(e) {
   return e.target.tagName == "TD"
}


function handleColorChange(e) {
    color = e.target.value
}

function handleChange(e) {
    const currentInput = e.target
    const isNumber = isInt(currentInput.value)
    if (isNumber) {
        drawTable()
        currentInput.classList.remove("error")
        return
    }
    currentInput.classList.add("error")
}



function handleMouseDown(e) {
    e.preventDefault()
    if (isCell(e)) {
        setBackground(e)
        isDrawing = true
    }
}

function handleMouseOver(e) {
    if(isCell(e)) {
        e.target.style.borderColor=primaryColor
        if (isDrawing){
            setBackground(e)
        }   
    }
}

function handleMouseLeave(e){
    if(isCell(e)){
        e.target.style.borderColor=textColor
    }
}

function handleMouseUp(e) {
    const newState = document.getElementsByTagName("tbody")[0].cloneNode(true)
    isDrawing = false
    state.push(newState)
}

function handleUndo(e) {
    const isCtrlZ = e.keyCode == 90 && e.ctrlKey
    
    if (isCtrlZ) {
        e.preventDefault();
        undoState()
    }
}

colorInput.addEventListener('change',handleColorChange)
rowsInput.addEventListener('keyup',handleChange)
colsInput.addEventListener('keyup',handleChange)
cellInput.addEventListener('keyup',handleChange)
document.addEventListener('keydown',handleUndo)
document.onload = drawTable()
