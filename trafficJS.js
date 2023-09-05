// Constants for cell types
const EMPTY_CELL = 0;
const HORIZONTAL_BARRIER = 1;
const VERTICAL_BARRIER = 2;
const STUD = 3;
const ANGLED_BARRIER = 4;
const SQUARE_CAR = 5;
const VERTICAL_CAR = 6;
const LONG_HORIZONTAL_CAR = 7;
const VERTICAL_LONG_CAR = 8;
const HORIZONTAL_TRUCK = 9;
const VERTICAL_TRUCK = 10;

// Constants for directions
const UP = "up";
const DOWN = "down";
const LEFT = "left";
const RIGHT = "right";
const HORIZONTAL = "horizontal"; 
const VERTICAL = "vertical";

// Grid size
let gridSizeX = 6; // Default value
let gridSizeY = 6; // Default value

// Difficulty level (0 to 100)
let difficulty = 50; // Default value

// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



// Function to initialize an empty grid
function initializeGrid() {
    const grid = [];
    for (let i = 0; i < gridSizeY; i++) {
        const row = [];
        for (let j = 0; j < gridSizeX; j++) {
            row.push(EMPTY_CELL);
        }
        grid.push(row);
    }
    return grid;
}
// Function to randomly place vehicles on the grid
function randomVehiclePlacement(grid) {
    // Calculate the maximum number of vehicles based on the grid size
    const maxVehicles = Math.floor(gridSizeX * gridSizeY / 10); // Adjust this factor as needed

    // Calculate the number of vehicles to place based on difficulty and maximum
    const numVehiclesToPlace = Math.floor((difficulty / 100) * maxVehicles);

    // Define the types of vehicles and their lengths
    const vehicleTypes = [
        { type: SQUARE_CAR, length: 2 },
        { type: VERTICAL_CAR, length: 2 },
        { type: LONG_HORIZONTAL_CAR, length: 3 },
        { type: VERTICAL_LONG_CAR, length: 3 },
        { type: HORIZONTAL_TRUCK, length: 4 },
        { type: VERTICAL_TRUCK, length: 4 },
    ];

    // Shuffle the vehicle types randomly
    for (let i = vehicleTypes.length - 1; i > 0; i--) {
        const j = getRandomInt(0, i);
        [vehicleTypes[i], vehicleTypes[j]] = [vehicleTypes[j], vehicleTypes[i]];
    }

    // Attempt to place vehicles on the grid
    let vehiclesPlaced = 0;
    while (vehiclesPlaced < numVehiclesToPlace) {
        // Randomly select a direction (horizontal or vertical)
        const direction = getRandomInt(0, 1) === 0 ? HORIZONTAL : VERTICAL;

        // Randomly select a position on the grid
        const x = getRandomInt(0, gridSizeX - 1);
        const y = getRandomInt(0, gridSizeY - 1);

        // Randomly select a vehicle type
        const randomType = getRandomInt(0, vehicleTypes.length - 1);
        const vehicleType = vehicleTypes[randomType];

        // Check if the vehicle can be placed in the selected position and direction
        if (canPlaceVehicle(grid, x, y, direction, vehicleType.length)) {
            // Place the vehicle on the grid
            placeVehicle(grid, x, y, direction, vehicleType.length, vehicleType.type);
            vehiclesPlaced++;
        }
    }
}



// Function to check if a vehicle can be placed in a given position and direction
function canPlaceVehicle(grid, x, y, direction, length) {
    // Check if the position and direction are valid
    if (x < 0 || x >= gridSizeX || y < 0 || y >= gridSizeY) {
        return false;
    }

    // Check if the vehicle goes out of bounds
    if ((direction === HORIZONTAL && x + length > gridSizeX) || (direction === VERTICAL && y + length > gridSizeY)) {
        return false;
    }

    // Check if the cells are empty
    for (let i = 0; i < length; i++) {
        if (direction === HORIZONTAL && grid[y][x + i] !== EMPTY_CELL) {
            return false;
        }
        if (direction === VERTICAL && grid[y + i][x] !== EMPTY_CELL) {
            return false;
        }
    }

    // If all checks pass, the vehicle can be placed
    return true;
}

// Function to place a vehicle on the grid
function placeVehicle(grid, x, y, direction, length, type) {
    for (let i = 0; i < length; i++) {
        if (direction === HORIZONTAL) {
            grid[y][x + i] = type;
        } else if (direction === VERTICAL) {
            grid[y + i][x] = type;
        }
    }
}


// Function to resize the textarea based on its content
function resizeTextarea() {
    document.getElementById("jsonResult").style.height = "auto";
    document.getElementById("jsonResult").style.height = (document.getElementById("jsonResult").scrollHeight) + "px";
    document.getElementById("jsonResult").style.width = "auto";
    document.getElementById("jsonResult").style.width = (document.getElementById("jsonResult").scrollWidth) + "px";
}




// Function to update the slider labels
function updateSliderLabels() {
    const gridSizeXSlider = document.getElementById("gridSizeX");
    const gridSizeYSlider = document.getElementById("gridSizeY");
    const difficultySlider = document.getElementById("difficultySlider");
    const gridSizeXLabel = document.getElementById("gridSizeXLabel");
    const gridSizeYLabel = document.getElementById("gridSizeYLabel");
    const difficultyLabel = document.getElementById("difficultyLabel");

    gridSizeXLabel.textContent = gridSizeXSlider.value;
    gridSizeYLabel.textContent = gridSizeYSlider.value;
    difficultyLabel.textContent = difficultySlider.value;

    // Generate the puzzle whenever a slider is changed
    generatePuzzle();
    
}

// Event listeners for the sliders
document.getElementById("gridSizeX").addEventListener("input", updateSliderLabels);
document.getElementById("gridSizeY").addEventListener("input", updateSliderLabels);
document.getElementById("difficultySlider").addEventListener("input", updateSliderLabels);


// Function to display the JSON result in the textarea
function displayJsonResult(jsonOutput) {
    const jsonResultTextarea = document.getElementById("jsonResult");
    // Split the JSON string into lines
    const lines = jsonOutput.split('\n');
    
    // Add tabulation for each line (except the first)
    const indentedLines = lines.map((line, index) => {
        return index === 0 ? line : '\t' + line;
    });
    
    // Join the lines with line breaks
    const indentedJson = indentedLines.join('\n');
    
    jsonResultTextarea.value = indentedJson;
    resizeTextarea();
}


// Function to generate the puzzle grid
function generatePuzzle() {
    // Get the grid size and difficulty from the input fields
    gridSizeX = parseInt(document.getElementById("gridSizeX").value);
    gridSizeY = parseInt(document.getElementById("gridSizeY").value);
    difficulty = parseInt(document.getElementById("difficultySlider").value);

    // Validate input values
    if (isNaN(gridSizeX) || isNaN(gridSizeY) || isNaN(difficulty)) {
        alert("Please enter valid values for grid size and difficulty.");
        return;
    }

    if (gridSizeX < 2 || gridSizeX > 22 || gridSizeY < 2 || gridSizeY > 22 || difficulty < 0 || difficulty > 100) {
        alert("Invalid input values. Grid size should be between 2 and 22, and difficulty between 0 and 100.");
        return;
    }

    // Initialize an empty grid
    const grid = initializeGrid();

    // Randomly place vehicles on the grid
    randomVehiclePlacement(grid);

    // Convert the grid to JSON format
    const jsonOutput = gridToJson(grid);

    // Display the JSON result in the textarea with line breaks
    displayJsonResult(jsonOutput);


    // Display the grid as a puzzle
    displayPuzzle(grid);

    

    // Output the JSON string with line breaks
    const jsonString = JSON.stringify(jsonOutput, null, 4);
    console.log(jsonString);
}

// Function to display the puzzle grid in the HTML
function displayPuzzle(grid) {
    const puzzleContainer = document.getElementById("puzzleContainer");
    puzzleContainer.innerHTML = ""; // Clear previous content

    // Create a table to display the grid
    const table = document.createElement("table");

    // Loop through the grid and create table cells
    for (let y = 0; y < gridSizeY; y++) {
        const row = document.createElement("tr");
        for (let x = 0; x < gridSizeX; x++) {
            const cell = document.createElement("td");
            cell.className = getCellClassName(grid[y][x]);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    // Add the table to the puzzle container
    puzzleContainer.appendChild(table);
}

// Function to get the CSS class name for a cell type
function getCellClassName(cellType) {
    switch (cellType) {
        case EMPTY_CELL:
            return "empty-cell";
        case HORIZONTAL_BARRIER:
            return "horizontal-barrier";
        case VERTICAL_BARRIER:
            return "vertical-barrier";
        case STUD:
            return "stud";
        case ANGLED_BARRIER:
            return "angled-barrier";
        case SQUARE_CAR:
            return "square-car";
        case VERTICAL_CAR:
            return "vertical-car";
        case LONG_HORIZONTAL_CAR:
            return "long-horizontal-car";
        case VERTICAL_LONG_CAR:
            return "vertical-long-car";
        case HORIZONTAL_TRUCK:
            return "horizontal-truck";
        case VERTICAL_TRUCK:
            return "vertical-truck";
        default:
            return "";
    }
}



// Function to convert the grid into JSON format
function gridToJson(grid) {
    const jsonRows = grid.map(row => {
        return "[" + row.map(cell => {
            switch (cell) {
                case EMPTY_CELL:
                    return 0;
                case HORIZONTAL_BARRIER:
                    return '"H"';
                case VERTICAL_BARRIER:
                    return '"V"';
                case STUD:
                    return 2;
                case ANGLED_BARRIER:
                    return 3;
                case SQUARE_CAR:
                    return 4;
                case VERTICAL_CAR:
                    return 5;
                case LONG_HORIZONTAL_CAR:
                    return 6;
                case VERTICAL_LONG_CAR:
                    return 7;
                case HORIZONTAL_TRUCK:
                    return 8;
                case VERTICAL_TRUCK:
                    return 9;
                default:
                    return 0;
            }
        }).join(",") + "]";
    });

    return `{
    "Pattern": [
${jsonRows.join(",\n")}
    ]
}`;
}





// Event listener for the Generate Puzzle button
document.getElementById("generateButton").addEventListener("click", generatePuzzle);

// Initial generation of the puzzle
generatePuzzle();
