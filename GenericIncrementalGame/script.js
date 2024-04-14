window.onload = function() {
    loadProgress();
}

let MoonRocks = 0;

// Mine rock! 
function mineMoonRocks() {
    MoonRocks += 1;
    updateMoonRocksDisplay();
}

// Save
function saveProgress() {
    document.cookie = "MoonRocks=" + MoonRocks + ";";
    document.cookie = "SmallDrill_Count=" + SmallDrill_Count + ";";
    document.cookie = "SmallDrill_Cost=" + SmallDrill_Cost + ";";
}

// Load progress from a cookie
function loadProgress() {
const cookies = document.cookie.split(';');
cookies.forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    switch (name) {
    case "currency":
        currency = parseFloat(value);
        break;
    case "generatorCount":
        generatorCount = parseInt(value);
        break;
    case "generatorCost":
        generatorCost = parseInt(value);
        break;
    }
});
}

// Generating rock
setInterval(function() {
    // small drill
    MoonRocks += SmallDrill_Production * SmallDrill_Count;

    // drill
    MoonRocks += Drill_Production * Drill_Count;

    updateMoonRocksDisplay();
}, 1000);

//update Moon Rocks
function updateMoonRocksDisplay() {
    document.getElementById("MoonRocks").innerText = MoonRocks;
}

// Small Drill
let SmallDrill_Cost = 10;
let SmallDrill_Count = 0;
let SmallDrill_Production = 1;

function buySmallDrill() {
    if (MoonRocks >= SmallDrill_Cost) {
    MoonRocks -= SmallDrill_Cost;
    SmallDrill_Count++;
    SmallDrill_Cost = Math.ceil(SmallDrill_Cost * 1.5);

    updateMoonRocksDisplay();

    // Update Small Drill Count
    document.getElementById("SmallDrill_Cost").innerText = SmallDrill_Cost;
    }
}

setInterval(function(){
    const buySmallDrillButton = document.getElementById("buySmallDrillButton");
    if (MoonRocks >= SmallDrill_Cost) {
        buySmallDrillButton.disabled = false;
    } else {
        buySmallDrillButton.disabled = true;
    }
}, 1);

// Drill
let Drill_Cost = 30;
let Drill_Count = 0;
let Drill_Production = 5;

function buyDrill()
{
    if(MoonRocks >= Drill_Cost) {
        MoonRocks -= Drill_Cost;
        Drill_Count++;
        Drill_Cost = Math.ceil(Drill_Cost * 2);

        updateMoonRocksDisplay();

        // Update Drill Count
        document.getElementById("Drill_Cost").innerText = Drill_Cost;
    }
}

setInterval(function(){
    const buyDrillButton = document.getElementById("buyDrillButton");
    if (MoonRocks >= Drill_Cost) {
        buyDrillButton.disabled = false;
    } else {
        buyDrillButton.disabled = true;
    }
}, 1);