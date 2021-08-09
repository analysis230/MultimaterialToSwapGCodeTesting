function loadDefaultPlaceHolders() {

    const filamentPositionsDefaults = getFilamentPositionsDefaults();

    for (let i = 0; i < 5; i++) {
        const currentFilament = "fil" + i;

        const fieldX = document.getElementById(currentFilament + "_x");
        const fieldY = document.getElementById(currentFilament + "_y");

        fieldX.placeholder = "X: " + filamentPositionsDefaults[currentFilament].x;
        fieldY.placeholder = "Y: " + filamentPositionsDefaults[currentFilament].y;

    }
}
loadDefaultPlaceHolders();


var filamentPositions = getFilamentPositionsDefaults();

