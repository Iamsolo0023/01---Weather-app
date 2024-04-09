// Define an object to store API key and base URL for weather API
const weatherApi = {
    key: "828cc99e0335c9476a8f751b7c386d9a",
    baseUrl: "https://api.openweathermap.org/data/2.5/weather"
}

// Get references to DOM elements
const loc = document.querySelector('#location'); // Selects element with id 'location'
const tempC = document.querySelector('.c'); // Selects element with class 'c'
const tempF = document.querySelector('.f'); // Selects element with class 'f'
const desc = document.querySelector('.desc'); // Selects element with class 'desc'
let dat, lat, long; // Declare variables for storing data

// Get reference to the input box
const searchInputBox = document.getElementById('input-box');

// Array of place names for suggestions (you can fetch this dynamically from an API)
const places = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 
    'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Visakhapatnam', 'Indore', 'Thane', 
    'Bhopal', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 
    'Meerut', 'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 
    'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah', 'Jabalpur', 'Gwalior', 'Vijayawada', 
    'Jodhpur', 'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Solapur', 'Hubli–Dharwad', 
    'Bareilly', 'Moradabad', 'Mysore', 'Gurgaon', 'Aligarh', 'Jalandhar', 'Tiruchirappalli', 
    'Bhubaneswar', 'Salem', 'Mira-Bhayandar', 'Warangal', 'Thiruvananthapuram', 'Guntur', 
    'Bhiwandi', 'Saharanpur', 'Gorakhpur', 'Bikaner', 'Amravati', 'Noida', 'Jamshedpur', 
    'Bhilai', 'Cuttack', 'Firozabad', 'Kochi', 'Nellore', 'Bhavnagar', 'Dehradun', 
    'Durgapur', 'Asansol', 'Rourkela', 'Nanded', 'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga', 
    'Jamnagar', 'Ujjain', 'Loni', 'Siliguri', 'Jhansi', 'Ulhasnagar', 'Jammu', 'Sangli-Miraj & Kupwad', 
    'Mangalore', 'Erode', 'Belgaum', 'Ambattur', 'Tirunelveli', 'Malegaon', 'Gaya', 'Jalgaon', 
    'Udaipur', 'Maheshtala', 'Tirupur', 'Davanagere', 'Kozhikode', 'Akbarpur', 'Bokaro', 
    'Darbhanga', 'Tumkur', 'Kurnool', 'Bihar Sharif', 'Gopalpur', 'Bhagalpur', 'Kharagpur', 
    'Sikar', 'Vellore', 'Panihati', 'Purnia', 'Rampur', 'Haridwar', 'Bilaspur', 'Shahjahanpur', 
    'Satara', 'Bijapur', 'Kakinada', 'Rampur', 'Shimoga', 'Chandrapur', 'Junagadh', 'Thrissur', 
    'Alwar', 'Bardhaman', 'Kulti', 'Nizamabad', 'Parbhani', 'Tinsukia', 'Singrauli', 'Nagercoil', 
    'Kollam', 'Raurkela', 'Patiala', 'Ajmer', 'Munger', 'Hapur', 'Bilaspur', 'Mathura', 'Kamarhati', 
    'Avadi', 'Panipat', 'Shivamogga', 'Amroha', 'Nizamabad', 'Suryapet', 'Bihar Sharif', 'Mau', 
    'Bhusawal', 'Ambarnath', 'Ozhukarai', 'Bareilly', 'Jalna', 'Agartala', 'Orai', 'Bhusawal', 
    'Puducherry', 'Sambalpur', 'Gandhinagar', 'Shillong', 'Port Blair', 'Kavaratti', 'New Delhi', 
    'Lakshadweep', 'Daman and Diu', 'Puducherry', 'Chandigarh', 'Dadra and Nagar Haveli', 'Ladakh'
];


// Function to initialize autocomplete
function initializeAutocomplete() {
    new Awesomplete(searchInputBox, { list: places }); // Initialize Awesomplete with list of places
}

// Event listener for when the window is loaded
window.addEventListener('load', () => {
    initializeAutocomplete(); // Initialize autocomplete when window is loaded

    // Fetch weather data
    fetch(`${weatherApi.baseUrl}?q=Mumbai&appid=${weatherApi.key}&units=metric`) // Fetch weather data using the baseUrl from weatherApi object
        .then((response) => {
            return response.json(); // Parse response as JSON
        })
        .then((data) => {
            // Extract necessary data from the response
            const { temp } = data.main; // Extract temperature
            const place = data.name; // Extract location
            const { description } = data.weather[0]; // Extract weather description

            // Convert temperature to Fahrenheit
            const fahrenheit = (temp * 9) / 5 + 32;

            // Interacting with DOM to show data
            loc.textContent = `${place}`; // Set location text content
            desc.textContent = `${description}`; // Set description text content
            tempC.textContent = `${temp.toFixed(2)} °C`; // Set temperature in Celsius
            //  tempF.textContent = `${fahrenheit.toFixed(2)} °F`; // Temperature in Fahrenheit is not displayed
            showWeatherImage(desc); // Display weather image based on description
        })
        .catch((error) => {
            console.error('Error fetching weather data:', error); // Log error if fetch fails
        });
});

// Event listener for keypress on search input box
searchInputBox.addEventListener('keypress', async (event) => {
    if (event.keyCode === 13) { // Check if Enter key is pressed
        console.log(searchInputBox.value); // Log the value of the input box
        await getWeatherReport(searchInputBox.value); // Get weather report for the input city
        document.querySelector('.weather-body').style.display = "block"; // Show weather body
    }
});

// Function to get weather report for a city
async function getWeatherReport(city) {
    try {
        const response = await fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`); // Fetch weather data for the city
        const data = await response.json(); // Parse response as JSON

        if (!response.ok) {
            throw new Error('Error while getting the weather report'); // Throw error if response is not ok
        }
        showWeatherReport(data); // Display weather report
        lat = data.coord.lat; // Get latitude of the city
        long = data.coord.lon; // Get longitude of the city
        await fetching(); // Fetch additional weather data
    } catch (err) {
        console.error(err); // Log error to console
        showErrorMessage(); // Show error message
    }
}

// Function to display error message
function showErrorMessage() {
    document.getElementById('city').innerText = 'Country/City Name Not Found'; // Set error message
    // clear previous output
    document.getElementById('date').innerText = ''; // Clear date
    document.getElementById('temp').innerText = ''; // Clear temperature
    document.getElementById('min-max').innerText = ''; // Clear min-max temperature
    document.getElementById('weather').innerText = ''; // Clear weather description
}

// Function to display weather image based on weather type
function showWeatherImage(WeatherType) {
    // Set background image based on weather description
    if (WeatherType.textContent === 'Clear') {
        document.body.style.backgroundImage = "url('clear1.jpg')"
    } else if (WeatherType.textContent === 'Clouds') {
        document.body.style.backgroundImage = "url('clouds1.jpg')"
    }
    else if (WeatherType.textContent === 'Snow') {
        document.body.style.backgroundImage = "url('snow.jpg')"
    }
}

// Function to display weather report
function showWeatherReport(weather) {
    let city = document.getElementById('city'); // Selects element with id 'city'
    city.innerText = `${weather.name},${weather.sys.country}`; // Set city name and country

    let temperature = document.getElementById('temp'); // Selects element with id 'temp'
    temperature.innerHTML = `${Math.round(weather.main.temp)}&deg;C`; // Set temperature in Celsius

    let minMaxTemp = document.getElementById('min-max'); // Selects element with id 'min-max'
    minMaxTemp.innerHTML = `${Math.floor(weather.main.temp_min)}&deg;C (min) / ${Math.ceil(weather.main.temp_max)}&deg;C (max)`; // Set min-max temperature

    let WeatherType = document.getElementById('weather'); // Selects element with id 'weather'
    WeatherType.innerText = `${weather.weather[0].main}`; // Set weather description

    let date = document.getElementById('date'); // Selects element with id 'date'
    let todayDate = new Date(); // Get current date
    date.innerText = dateManage(todayDate); // Display formatted date
    showWeatherImage(WeatherType); // Display weather image based on type
}

// Function to format date
function dateManage(dateArg) {
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; // Array of days
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; // Array of months
    let year = dateArg.getFullYear(); // Get full year
    let month = months[dateArg.getMonth()]; // Get month name
    let date = dateArg.getDate(); // Get day of the month
    let day = days[dateArg.getDay()]; // Get day of the week

    return `${date} ${month} (${day}), ${year}`; // Return formatted date string
}

// Function to fetch additional weather data
async function fetching() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${weatherApi.key}&units=metric`); // Fetch additional weather data
        const data = await response.json(); // Parse response as JSON

        if (!response.ok) {
            throw new Error('Error while fetching the weather'); // Throw error if response is not ok
        }
        dat = data; // Store fetched data
        // Load Google Charts library and draw chart
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);
    } catch (err) {
        console.error(err); // Log error to console
    }
}

// Function to draw temperature chart
function drawChart() {
    // Extract data for chart
    let unix_time_0 = dat.hourly[0].dt;
    // Extract more data for other hours...
    const hour0 = format(new Date(unix_time_0 * 1000));
    // Format more hours...

    // Set Data for chart
    const data = google.visualization.arrayToDataTable([
        ['Time', 'Temperature', { role: 'style' }],
        [hour0, Math.floor(dat.hourly[0].temp), 'color:black'], // Add data for hour 0
        // Add more data for other hours...
    ]);

    // Set Options for chart
    const options = {
        title: 'time vs. temperature',
        hAxis: { title: 'Time in Hours' },
        vAxis: { title: 'Temperature in °C' },
        legend: 'none',
        tooltip: { isHtml: true },
        backgroundColor: 'transparent',
        color: 'black',
        is3D: true,
        allowHtml: true,
    };

    // Draw chart
    document.querySelector("#myChart").style.display = "block";
    const chart = new google.visualization.AreaChart(document.getElementById('myChart'));
    chart.draw(data, options);
}

// Function to format date
function format(date) {
    let hours = date.getHours();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return hours + ' ' + ampm;
}

// Event listener for window resize
window.onresize = (function () {
    drawChart(); // Redraw chart on window resize
});

