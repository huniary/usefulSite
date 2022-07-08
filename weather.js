const API_KEY = "e0af52d610c246e7432cbf1a19f604fa";
const weather = document.querySelector("#weather");
const weatherinput = document.getElementById("weatherinput");
const weatherForm = document.getElementById("weaterForm");
const oneDay = document.getElementById("oneDay");
const clean = document.getElementById("clean");

let weatherArray = [];
const tokyo = localStorage.getItem("setWeather");
weatherForm.addEventListener("submit", getLocationWeather);
clean.addEventListener("click", clenWeatehr);

if (tokyo) {
  const tokyoArray = JSON.parse(tokyo);
  tokyoArray.forEach((wet) => {
    paintWeather(wet);
  });
  weatherArray = tokyoArray;
}

function clenWeatehr() {
  localStorage.removeItem("setWeather");
  window.location.reload();
}

async function getLocationWeather(e) {
  e.preventDefault();
  const locationIn = weatherinput.value;
  for (i = 0; weatherArray.length > i; i++) {
    if (weatherArray[i].name.toUpperCase() === locationIn.toUpperCase()) {
      weatherinput.value = "";
      return alert("있어요");
    }
  }
  if (!locationIn) return;

  const loocationUrl = `https://api.openweathermap.org/data/2.5/weather?q=${locationIn}&appid=${API_KEY}&units=metric`;
  try {
    const res = await fetch(loocationUrl);
    const data = await res.json();

    const temp = `${Math.floor(parseInt(data.main.temp))}℃`;

    const { main } = data.weather[0];
    const { name } = data;

    const newWeatherObj = {
      name,
      temp,
      main,
    };

    weatherArray.push(newWeatherObj);

    localStorage.setItem("setWeather", JSON.stringify(weatherArray));
    paintWeather(newWeatherObj);
  } catch (e) {
    alert("그런 도시는없ㄷ어!!");
  }

  weatherinput.value = "";
}

function paintWeather(obj) {
  const { name, temp, main } = obj;
  const weatherLi = document.createElement("li");
  weatherLi.id = obj.name;

  weatherLi.innerText = `${temp} ${main} ${name} `;

  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "x";
  deleteBtn.addEventListener("click", removeClick);
  weatherLi.appendChild(deleteBtn);
  oneDay.appendChild(weatherLi);
}

function removeClick(e) {
  const li = e.target.parentElement;
  weatherArray = weatherArray.filter((weather) => weather.name !== li.id);
  localStorage.setItem("setWeather", JSON.stringify(weatherArray));
  li.remove();
  console.log(weatherArray);
}

// navigator.geolocation.getCurrentPosition(handelSuccess, handleError);
// 현재위치표시하는 함수(성공할때콜백함수,실패할때 콜백함수)

// function handelSuccess(p) {
//   const { coords } = p; //p안에 있는 coords(7개요소있음) 만 넣겟다 timestamp도 있지만 timestamp는 안넣는다
//   const { latitude, longitude } = coords; // coords 안에 있는 latitude와 longitude만 쓰겠다
//   //     const lat = p.coords.latitude;// 위에 두개 합치면 = p.coords; 작성가능
//   //     const lon = p.coords.longitude;  // 위에랑 같으 말?

//   const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

//   fetch(url).then((response) => {
//     return response.json().then((data) => {
//       // weather.innerText = data.main.temp + "C";  밑에꺼랑 같은 의미
//       const { temp } = data.main;
//       //weather.innerText = temp + "C";
//       const { main } = data.weather[0];
//       const { name } = data;
//       weather.innerText = `${temp} ${main} ${name} `;
//     });
//   });
// }

// function handleError() {
//   alert("현재위치를 알수없습니다");
// }
