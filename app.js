// globals
const SUBMIT = document.getElementById('btn');
const FORM = document.getElementById('dino-compare');

// Create Dino Constructor
function Dino(dino) {
    this.species = dino.species;
    this.weight = dino.weight;
    this.height = dino.height;
    this.diet = dino.diet;
    this.where = dino.where;
    this.when = dino.when;
    this.fact = dino.fact;
    this.picture = "./images/" + dino.species.toLowerCase() + ".png";
}

// fetch dino.json
async function readDino() {
    return fetch("./dino.json");
}

// Create Dino Objects
let dinos = [];
readDino().then(
    res => {
        return res.json();
    }
).then(
    d => {
        dinos = d["Dinos"].map((dino) => {
            return new Dino(dino);
        });
    }
).catch(err => {
    console.log(err);
})

// Create Human Object
function Human(name, feet, inches, weight, diet) {
    this.name = name;
    this.feet = feet;
    this.inches = inches;
    this.weight = weight;
    this.diet = diet;
    this.picture = "./images/human.png"
}


// Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs, height in inches.
// NOTE: Human height is feet and inches
Dino.prototype.compareDiet = function (human) {
    if (this.diet === human.diet) {
        return `You and I are both ${this.diet}s!`
    } else {
        return `${this.species} is a ${this.diet}, but you are a ${human.diet}`
    }
}

// Create Dino Compare Method 2
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareHeight = function (human) {
    let human_height = human.feet * 12 + human.inches;

    if (this.height < human_height) {
        return `You are ${human_height - this.height} inch(es) taller than the ${this.species}.`
    } else if (this.height > human.feet * 12 + human.inches) {
        return `The ${this.species} is ${this.height - human_height} inch(es) taller than you.`
    } else {
        return `Hey, you guys are the same height!`
    }
}


// Create Dino Compare Method 3
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareWeight = function (human) {
    if (this.weight < human.weight) {
        return `You weigh ${human.weight - this.weight} pound(s) more than the ${this.species}.`
    } else if (this.weight > human.weight) {
        return `The ${this.species} weighs ${this.weight - human.weight} pound(s) more than you.`
    } else {
        return `Hey, you guys have the same weight!`
    }
}


// three more facts about dinos
Dino.prototype.getFact = function () {
    return this.fact
}
Dino.prototype.getWhen = function () {
    return `${this.species} lived in the ${this.when} era.`
}
Dino.prototype.getWhere = function () {
    return `${this.species} could be found in ${this.where}.`
}


// util for generating a random number between 0 and 5
function randomFactNumber() {
    return Math.floor(Math.random() * 6);
}

function makeHumanTile(human) {
    return `
        <div class="grid-item">
            <h3>${human.name}</h3>
            <img src="${human.picture}"></img>
        </div>
    `
}

function makeDinoTile(dino, human) {
    let random_fact = '';
    switch (randomFactNumber()) {
        case 0:
            random_fact = dino.getFact();
            break;
        case 1:
            random_fact = dino.getWhere();
            break;
        case 2:
            random_fact = dino.compareDiet(human);
            break;
        case 3:
            random_fact = dino.compareWeight(human);
            break;
        case 4:
            random_fact = dino.compareHeight(human);
            break;
        default:
            random_fact = dino.getWhen();
    }

    return (dino.species === "Pigeon") ? `
        <div class='grid-item'>
            <h3>${dino.species}</h3>
            <img src="${dino.picture}"></img>
            <p>All birds are living dinosaurs.</p>

        </div>
    ` : `
        <div class='grid-item'>
            <h3>${dino.species}</h3>
            <img src="${dino.picture}"></img>
            <p>${random_fact}</p>
        </div>
    `
}

// On button click, prepare and display infographic
SUBMIT.addEventListener('click', () => {
    // Remove form from screen
    FORM.style.display = 'none';

    // Use IIFE to get human data from form
    let human = (function () {
        let name = document.getElementById("name").value;
        let feet = document.getElementById("feet").value;
        let inches = document.getElementById("inches").value;
        let weight = document.getElementById("weight").value;
        let diet = document.getElementById("diet").value;

        return new Human(name,
            parseInt(feet),
            parseInt(inches),
            parseInt(weight),
            diet
        );

    })();

    let gg = document.getElementById("grid")

    // Generate Tiles for each Dino in Array
    let dinotiles = dinos.map((d) => {
        return makeDinoTile(d, human)
    });

    let humantile = []
    humantile.push(makeHumanTile(human));

    let alltiles = [];
    alltiles.push(...dinotiles.slice(0, 4), ...humantile, ...dinotiles.slice(4));

    // Add tiles to DOM
    gg.innerHTML = alltiles.join('');
})