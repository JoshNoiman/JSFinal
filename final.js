//apiKey recieved from creating account with openweathermap
const apiKey = '2e72cdd2a7c758c823edcaa6e784e970';

//the city we are getting our weather info from
const city = 'Cincinnati';

//api url to connect to openweathermap to receive our weather data
const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

//asynch function to fetch our weather data
async function getWeather() 
{
    try {
        const response = await fetch(weatherApiUrl);
        const data = await response.json();

        // Check if the response is valid and contains the expected properties
        if (data && data.weather && data.weather[0] && data.main) {
            return data;  // Return valid weather data
        } else {
            console.error('Invalid weather data received:', data);
            return null;  // Return null if data is missing or invalid
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;  // Return null on error
    }
}

//updating weather and background image based on the results
async function updateWeather() {
    const weatherData = await getWeather();

    // Check if we have valid weather data
    if (!weatherData) {
        console.error('Weather data is not available.');
        return;  // Exit the function if weather data is invalid
    }

    const currentWeather = weatherData.weather[0].main;
    //const currentWeather = 'Clear';
    const temperature = weatherData.main.temp;

    switch (currentWeather) {
        case 'Clear':
            backgroundImage.src = 'assets/sunnyFarm.png';
            break;
        case 'Rain':
            backgroundImage.src = 'assets/rainyFarm.png';
            break;
        case 'Snow':
            backgroundImage.src = 'assets/snowyFarm.png';
            break;
        case 'Clouds':
            backgroundImage.src = 'assets/cloudyFarm.png';
            break;
        default:
            backgroundImage.src = 'assets/defaultFarm.png';
            break;
    }

    // Also update the displayed weather information
    drawWeather(weatherData);
};

//calling update weather function
updateWeather();

//getting game canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//defining player attributes
let player = {
    x: 400,
    y: 550,
    width: 50,
    height: 50,
    image: new Image(),
    speed: 5
};

//creating variables to hold boars and score
let boars = [];
let score = 0;

//setting background image 
let backgroundImage = new Image();
backgroundImage.src = 'assets/defaultFarm.png';

//setting player image
player.image.src = 'assets/player.png';

//setting controls
let keys = {
    left: false,
    right: false,
    up: false,
    down: false
};

//creating boars
function createBoar() {
    const boar = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        width: 50,
        height: 50,
        image: new Image(),
        dx: Math.random() * 4 - 2,  
        dy: Math.random() * 4 - 2 
    };
    //using png for boar image
    boar.image.src = 'assets/boar.png';
    boars.push(boar);
}

//checking for collision
function isCollision(player, boar) {
    return player.x < boar.x + boar.width &&
           player.x + player.width > boar.x &&
           player.y < boar.y + boar.height &&
           player.y + player.height > boar.y;
}

//"drawing" background using png recieved based on weather or default
function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

//"drawing" player using player.png which is my friend Thomas
function drawPlayer() {
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}

//"drawing" boar using boar png
function drawBoars() {
    boars.forEach(boar => {
        ctx.drawImage(boar.image, boar.x, boar.y, boar.width, boar.height);
    });
}

//update game loop constantly refreshing
function updateGame() {
    if (keys.left && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys.right && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
    if (keys.up && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys.down && player.y < canvas.height - player.height) {
        player.y += player.speed;
    }

    boars.forEach(boar => {
        boar.x += boar.dx;
        boar.y += boar.dy;

        if (boar.x < 0 || boar.x + boar.width > canvas.width) {
            boar.dx = -boar.dx;
        }
        if (boar.y < 0 || boar.y + boar.height > canvas.height) {
            boar.dy = -boar.dy;
        }

        if (isCollision(player, boar)) {
            score += 10;
            boar.x = Math.random() * canvas.width;
            boar.y = Math.random() * canvas.height * 0.5;
            boar.dx = Math.random() * 4 - 2;
            boar.dy = Math.random() * 4 - 2;
        }
    });

    drawBackground();
    drawPlayer();
    drawBoars();
    drawScore();
    drawWeather();
    drawUsername();

    requestAnimationFrame(updateGame);
}

//"drawing" score
function drawScore() {
    ctx.font = "32px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 16, 40);
}

//"drawing" the weather info on the canvas
function drawWeather(weatherData) {
    if (weatherData) {
        const temperatureFahrenheit = (weatherData.main.temp * 9/5) + 32;

        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(`Weather: ${weatherData.weather[0].main}`, 16, 80);
        ctx.fillText(`Temp: ${Math.round(temperatureFahrenheit)}°F`, 16, 110);
    }
}

//"drawing" username from input
function drawUsername() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`Username: ${username}`, canvas.width - 200, 40);
}

//starting game
function startGame() {

    username = document.getElementById("usernameInput").value;

    if (username.trim() === "") {
        alert("Please enter a username to start the game.");
        return;
    }

    document.getElementById("usernameForm").style.display = "none";

    for (let i = 0; i < 5; i++) {
        createBoar();
    }

    window.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") keys.left = true;
        if (event.key === "ArrowRight") keys.right = true;
        if (event.key === "ArrowUp") keys.up = true;
        if (event.key === "ArrowDown") keys.down = true;
    });

    window.addEventListener("keyup", (event) => {
        if (event.key === "ArrowLeft") keys.left = false;
        if (event.key === "ArrowRight") keys.right = false;
        if (event.key === "ArrowUp") keys.up = false;
        if (event.key === "ArrowDown") keys.down = false;
    });

    updateGame();
}

//when background image is loaded start the game
backgroundImage.onload = function() {
    startGame();
};