const wrapper = document.querySelector('.wrapper'),
inputPart = wrapper.querySelector('.input-part'),
infoTxt = inputPart.querySelector('.info-txt'),
inputField = inputPart.querySelector('input'),
locationBtn = inputPart.querySelector('button'),
wIcon = document.querySelector('.weather-part img'),
arrowBack = wrapper.querySelector('header i');

let api;

inputField.addEventListener("keyup", e =>{ 
    //If user press enter btn and input value is not empty
    if(e.key == "Enter" && inputField.value != ''){    
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener('click', () => {
    if(navigator.geolocation) { //If browser suppor  geolocation APi
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert('Your browse doesn\'t support geolocation API' );
    }
});

function onSuccess(position) {
    const {latitude, longitude} = position.coords; // getting lat and lon of the user device 
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=pl&appid=${apiKey}`;
    fetchData();
}

function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add('error');
}

const apiKey = '572b1cc530c5ecb5bc73b11b4f87ec81';

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pl&appid=${apiKey}`;
    fetchData();
}

function fetchData() {
    infoTxt.innerText = 'Getting weather details...';
    infoTxt.classList.add('pending');
    //getting apoi response and returning it with parsing into js and in another
    //then function calling weatherDetails function with passing api result as an argument
    fetch(api).then(response => response.json()).then(result => weatherDeatils(result));
}

function weatherDeatils(info) {
    if(info.cod == '404') {
        infoTxt.innerText = `${inputField.value} insn\'t a valid city name`;
        infoTxt.classList.replace('pending', 'error');
    } else {
        //Properties from info object
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        if(id == 800) {
            wIcon.src = "icons/clear.svg"
        } else if(id >= 200 && id <=232) {
            wIcon.src = "icons/storm.svg"
        } else if(id >= 600 && id <=622) {
            wIcon.src = "icons/snow.svg"
        } else if(id >= 701 && id <=781) {
            wIcon.src = "icons/haze.svg"
        } else if(id >= 801 && id <=804) {
            wIcon.src = "icons/cloud.svg"
        } else if((id >= 300 && id <=321) || (id >=500 && id <= 531)) {
            wIcon.src = "icons/rain.svg"
        }
      

        //Pass values to HTML
        wrapper.querySelector('.temp .numb').innerText = Math.floor(temp);
        wrapper.querySelector('.weather').innerText = description;
        wrapper.querySelector('.location span').innerText = `${city}, ${country}`;
        wrapper.querySelector('.temp .numb-2').innerText = Math.floor(feels_like);
        wrapper.querySelector('.humidity span').innerText = `${humidity}%`;

        infoTxt.classList.remove('pending', 'error');
        wrapper.classList.add('active')
        console.log(info);
    }
}

arrowBack.addEventListener('click', () => {
    wrapper.classList.remove('active')
})

