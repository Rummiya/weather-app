// Апи ключь
const API_KEY = '63222dcd71eeb8ba0e2d38c4cf9230cd';

// Находим элементы из документа
const $form = document.querySelector('.form');
const $input = document.querySelector('.form__input');

// Вешаем слушатель событий
$form.onsubmit = submitHandler;

document.addEventListener('DOMContentLoaded', async () => {
	let defaultCity = localStorage.getItem('lastCity') || 'Bishkek';
	$input.value = defaultCity;
	await submitHandler(new Event('submit'));
});

async function submitHandler(e) {
	// Отменяем перезагрузку сайта
	e.preventDefault();

	const cityName = $input.value.trim();

	// Проверяем ввел ли пользователь какие-то данные
	if (!cityName) {
		console.log('Enter city name');
		return;
	}

	// Очищаем строку поиска
	$input.value = '';

	// Получаем координаты города
	const cityInfo = await getGeo(cityName);

	// Если пользователь ввел некорректное название выходим из функции
	if (!cityInfo.length) return;

	// Получаем данные о погоде
	const weatherInfo = await getWeather(cityInfo[0]['lat'], cityInfo[0]['lon']);

	// Записываем нужные данные
	const weatherData = {
		name: cityInfo[0]['name'],
		temp: weatherInfo.main.temp,
		humidity: weatherInfo.main.humidity,
		speed: weatherInfo.wind.speed,
		weather: weatherInfo.weather[0]['main'],
	};

	// Рендерим на странице
	renderWeatherData(weatherData);
	localStorage.setItem('lastCity', cityName);
}

// Получение координат города
async function getGeo(name) {
	const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${API_KEY}`;
	const response = await fetch(geoURL);
	const data = await response.json();

	return data;
}

// Получение данных о погоде
async function getWeather(lat, lon) {
	const weatherURL = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${API_KEY}`;
	const response = await fetch(weatherURL);
	const data = await response.json();

	return data;
}

// Рендер погоды
function renderWeatherData(data) {
	// Отображаем блоки с информацией
	// document.querySelector('.weather__info').classList.remove('none');
	// document.querySelector('.weather__details').classList.remove('none');

	// Отображаем информацию о погоде
	const $temp = document.querySelector('.weather__temp'),
		$city = document.querySelector('.weather__city'),
		$humidity = document.querySelector('#humidity'),
		$speed = document.querySelector('#speed'),
		$image = document.querySelector('.weather__img'),
		$name = document.querySelector('.weather__name');

	$temp.innerText = Math.round(data.temp) + '°c';
	$city.innerText = data.name;
	$humidity.innerText = data.humidity + '%';
	$speed.innerText = data.speed + ' km/h';
	$name.innerText = data.weather;

	const imageNames = {
		Clouds: 'clouds',
		Clear: 'clear',
		Cloudy: 'cloudy',
		Drizzle: 'drizzle',
		Mist: 'mist',
		Rain: 'rain',
		Snow: 'snow',
	};

	if (imageNames[data.weather]) {
		$image.src = `./img/weather/${imageNames[data.weather]}.png`;
	}

	// switch (data.weather) {
	//     case 'Clear':
	//         image.setAttribute('src', './img/weather/clear.png')
	//         break;

	//     case 'Clouds':
	//         image.setAttribute('src', './img/weather/clouds.png')
	//         break;

	//     case 'Cloudy':
	//         image.setAttribute('src', './img/weather/cloudy.png')
	//         break;

	//     case 'Drizzle':
	//         image.setAttribute('src', './img/weather/drizzle.png')
	//         break;

	//     case 'Mist':
	//         image.setAttribute('src', './img/weather/mist.png')
	//         break;

	//     case 'Rain':
	//         image.setAttribute('src', './img/weather/rain.png')
	//         break;

	//     case 'Snow':
	//         image.setAttribute('src', './img/weather/snow.png')
	//         break;

	//     default:
	//         break;
	// }
}
