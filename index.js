///////DEFAULTS/////////////

const filamentNamesDefaults = {
    fil0: "Filament 0",
    fil1: "Filament 1",
    fil2: "Filament 2",
    fil3: "Filament 3",
    fil4: "Filament 4",
};

const bedSizes = {
    "PrusaMk3s": { x: 250, y: 210 },
    "PrusaMini": { x: 180, y: 180 },
    "Ender3": { x: 225, y: 225 }
}


function getFilamentPositionsDefaults() {

    const selectorValue = document.getElementById("printers").value;

    const bedSize = bedSizes[selectorValue];

    const defaults = {};

    defaults["fil0"] = { x: 0, y: 0 };
    defaults["fil1"] = { x: bedSize.x, y: 0 };
    defaults["fil2"] = { x: 0, y: bedSize.x };
    defaults["fil3"] = { x: bedSize.x, y: bedSize.y };
    defaults["fil4"] = { x: bedSize.x / 2, y: 0 };

    return defaults;

}


///////DEFAULTS/////////////


var filamentNames = { ...filamentNamesDefaults };



function setValue(fieldName) {

    const field = document.getElementById(fieldName);


    filamentNames[fieldName] = field.value;


    if (filamentNames[fieldName].length === 0)
        filamentNames[fieldName] = filamentNamesDefaults[fieldName];

}



function setPosition(fieldName) {

    const filamentPositionsDefaults = getFilamentPositionsDefaults();

    const field = document.getElementById(fieldName)

    const filamentName = fieldName.split("_")[0];
    const coordName = fieldName.split("_")[1];


    filamentPositions[filamentName][coordName] = Number(field.value);


    if (filamentPositions[filamentName][coordName].length === 0 || filamentPositions[filamentName][coordName] == 0)
        filamentPositions[filamentName][coordName] = filamentPositionsDefaults[filamentName][coordName];



}

function download(filename, text) {
    console.log("downloading")
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function resetFileUpload() {
    const oldInput = document.getElementById("file-upload");

    const newInput = document.createElement("input");

    newInput.type = "file";
    newInput.id = oldInput.id;

    oldInput.parentNode.replaceChild(newInput, oldInput);
}


function showPage(pageId) {
    const page = document.getElementById(pageId);

    page.style.display = 'flex';
}

function hidePage(pageId) {

    const page = document.getElementById(pageId);
    page.style.display = 'none';
}

function reloadBedConstraints() {
    filamentPositions = getFilamentPositionsDefaults();
    loadDefaultPlaceHolders();

}


/////////************ Critical Functions */
function processFile_PrusaMk3s() {

    const inputField = document.getElementById("file-upload");

    const file = inputField.files[0]

    const reader = new FileReader();

    reader.onload = (event) => {
        const file = event.target.result;
        const allLines = file.split(/\r\n|\n/);
        // Reading line by line

        const regex = /\s+/;

        console.log("processing")


        var processedLines = []
        var prevTool;
        var prevIndex;
        const regexToTest = /^\s*T[0-9]\s*(;.*)?$/g;
        const regexToExtract = /T[0-9]/g;

        for (let i = 0; i < allLines.length; i++) {

            const line = allLines[i];


            if (regexToTest.test(line)) {

                const toolNumber = "fil" + Number(line.match(regexToExtract)[0].substring(1));


                processedLines.push([toolNumber, prevTool]);

                if (prevIndex !== undefined)
                    processedLines[prevIndex].push(toolNumber);

                prevIndex = i;
                prevTool = toolNumber;
            }
            else {
                processedLines.push(line);
            }


        }

        const finalGCode = processedLines.flatMap((line) => {

            if (Array.isArray(line)) {

                const [toolNumber, prevTool, nextTool] = line;

                const messageLine1 = "M117 " + filamentNames[toolNumber];

                const filamentChangeLine = "M600 " + "X" + filamentPositions[toolNumber].x + " Y" + filamentPositions[toolNumber].y;


                const messageLine2 = (() => {
                    if (nextTool !== undefined)
                        return "M117 " + filamentNames[nextTool];
                    else
                        return "";
                }).call(this)


                return [messageLine1, filamentChangeLine, messageLine2]


            }
            else {
                return [line]
            }
        }).join("\n")

        console.log("processed")
        download("processed.gcode", finalGCode);

    };

    reader.onerror = (event) => {
        alert(event.target.error.name);
    };

    reader.readAsText(file);

    resetFileUpload();
}

function processFile_PrusaMk3s() {

    const inputField = document.getElementById("file-upload");

    const file = inputField.files[0]

    const reader = new FileReader();

    reader.onload = (event) => {
        const file = event.target.result;
        const allLines = file.split(/\r\n|\n/);
        // Reading line by line

        const regex = /\s+/;

        console.log("processing")


        var processedLines = []
        var prevTool;
        var prevIndex;
        const regexToTest = /^\s*T[0-9]\s*(;.*)?$/g;
        const regexToExtract = /T[0-9]/g;

        for (let i = 0; i < allLines.length; i++) {

            const line = allLines[i];


            if (regexToTest.test(line)) {

                const toolNumber = "fil" + Number(line.match(regexToExtract)[0].substring(1));


                processedLines.push([toolNumber, prevTool]);

                if (prevIndex !== undefined)
                    processedLines[prevIndex].push(toolNumber);

                prevIndex = i;
                prevTool = toolNumber;
            }
            else {
                processedLines.push(line);
            }


        }

        const finalGCode = processedLines.flatMap((line) => {

            if (Array.isArray(line)) {

                const [toolNumber, prevTool, nextTool] = line;

                const messageLine1 = "M117 " + filamentNames[toolNumber];

                const filamentChangeLine = "M600 " + "X" + filamentPositions[toolNumber].x + " Y" + filamentPositions[toolNumber].y;


                const messageLine2 = (() => {
                    if (nextTool !== undefined)
                        return "M117 " + filamentNames[nextTool];
                    else
                        return "";
                }).call(this)


                return [messageLine1, filamentChangeLine, messageLine2]


            }
            else {
                return [line]
            }
        }).join("\n")

        console.log("processed")
        download("processed.gcode", finalGCode);

    };

    reader.onerror = (event) => {
        alert(event.target.error.name);
    };

    reader.readAsText(file);

    resetFileUpload();
}


function processFile() {

    const selectorValue = document.getElementById("printers").value;
    switch (selectorValue) {
        case "PrusaMk3s":
            processFile_PrusaMk3s();
            break;

        case "PrusaMini":
            processFile_PrusaMk3s();
            break;

        case "Ender3":
            processFile_PrusaMk3s();
            break;
    }

}



function downloadConfig() {

    const selectorValue = document.getElementById("printers").value;

    var element = document.createElement('a');
    element.setAttribute('href', './' + selectorValue + "_config.ini");
    element.setAttribute('download', selectorValue + "_config.ini");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);


}