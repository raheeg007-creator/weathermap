const API_KEY = '868ff817f39bfd9eca2e584bd870a1de';
let pin = null;
const map = L.map('map').setView([15.5007, 32.5599], 6);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const formWeather = document.getElementById('search-form');
const inputCity = document.getElementById('city-input');
// إضافة مستمع الحدث للنموذج عند الإرسال
formWeather.addEventListener('submit', async function (event) {
  event.preventDefault();
  const city = inputCity.value.trim();
  if (city === '') {
    return;
  }

  //  إخفاء الرسالة القديمة وإظهار الـ spinner
  hideMessage();
  showSpinner();
//  استخدام try-catch-finally للتعامل مع الأخطاء
  try {
    const cityCoordinates = await getCityCoordinates(city);

    if (cityCoordinates === null) {
// إظهار رسالة خطأ إذا لم يتم العثور على المدينة
    showMessage('City not found', 'error');      
    return;
    }

    const weatherData = await getWeatherData(cityCoordinates);
    updatePin(cityCoordinates.lat, cityCoordinates.lon, weatherData, city);
  } catch (error) {
    // 3. كارد خطأ ودي بدل console.error
    showMessage(error.message, 'error');
    console.error(error);
  } finally {
    // 4. إخفاء الـ spinner
    hideSpinner();
  }
});

  // دالة تحوّل اسم المدينة إلى إحداثيات باستخدام Nominatim

 async function getCityCoordinates(cityName) {
  
  // بناء رابط البحث مع تشفير اسم المدينة لتفادي مشاكل المسافات والحروف العربية
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&featuretype=city&q=${encodeURIComponent(cityName)}`;
  // إرسال الطلب وانتظار الرد
  const response = await fetch(url);

  // اعلام بالخطأ إذا فشل الطلب
 if (!response.ok) {
    throw new Error('Request failed');
  }

  // 4. حول الرد لـ JSON
  const data = await response.json();

  // 5. لو المصفوفة فاضية، رجع بـ null
  if (data.length === 0) {
    return null;
  }

  // إرجاع خط العرض والطول كأرقام   
  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon)
  };
}
// دالة تجلب الطقس الحالي من OpenWeatherMap بحسب الإحداثيات

async function getWeatherData(cityCoordinates) {
    // بناء الرابط بوحدة القياس المترية 
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(cityCoordinates.lat)}&lon=${encodeURIComponent(cityCoordinates.lon)}&appid=${API_KEY}&units=metric`;
    //  خطأ إذا فشل الطلب
  const response = await fetch(url);
  if (!response.ok) {
  if (response.status === 404) {
    throw new Error(' Weather data not found for the given coordinates');
  }
  throw new Error('Weather request failed');
}
    // استخراج القيم المطلوبة فقط من الرد المتداخل
  const data = await response.json();
  return {
  name: data.name,
  temp: data.main.temp,
  humidity: data.main.humidity,
  windSpeed: data.wind.speed,
  clouds: data.clouds.all,
  description: data.weather[0].description,
  icon: data.weather[0].icon
}
  }
  // دالة لتحديث موقع الدبوس على الخريطة
  function updatePin(lat, lon , WeatherData ,searchedName) {
  if (pin !== null) {
    pin.remove();
  }
// إنشاء دبوس جديد على الخريطة وربطه ببيانات الطقس
  pin = L.marker([lat, lon]).addTo(map);
  pin.bindPopup(createPopup(WeatherData, searchedName), { autoPanPadding: [20, 20] });
  map.flyTo([lat, lon], 7); 
 map.once('moveend', function () {
  pin.openPopup();
});

}
// دالة لإنشاء نافذة منبثقة تعرض بيانات الطقس
function createPopup(popupData ,searchedName) {
  const card = document.createElement('div');
  card.classList.add('popup-card');
  // إنشاء عناصر HTML لعرض بيانات الطقس
   // إنشاء عنوان وغطاء وصورة الطقس
  const title = document.createElement('h3');
    title.classList.add('popup-title');
  title.textContent = searchedName;
  const cover = document.createElement('img');
    cover.classList.add('popup-cover');
 // استخدام أيقونة الطقس من OpenWeatherMap
  cover.src = `https://openweathermap.org/img/wn/${popupData.icon}@2x.png`;
  cover.alt = popupData.description;
 // إنشاء عناصر نصية لعرض درجة الحرارة والرطوبة وسرعة الرياح وغيوم السماء
   const tempText = document.createElement('p');
    tempText.classList.add('popup-text');
    tempText.textContent = `Temperature: ${popupData.temp}°C`;
        const humidityText = document.createElement('p');
    humidityText.classList.add('popup-text');
    humidityText.textContent = `Humidity: ${popupData.humidity}%`;
        const windText = document.createElement('p');
    windText.classList.add('popup-text');
    windText.textContent = `Wind Speed: ${popupData.windSpeed} m/s`;
        const cloudsText = document.createElement('p');
    cloudsText.classList.add('popup-text');
    cloudsText.textContent = `Clouds: ${popupData.clouds}%`;
  // إنشاء زر للمشاركة
  const shareBtn = document.createElement('button');
  shareBtn.classList.add('popup-shareBtn');
  shareBtn.textContent = 'Share';
  // إضافة مستمع الحدث للزر للمشاركة
  shareBtn.addEventListener('click', async function () {
    // إنشاء نص المشاركة باستخدام بيانات الطقس
  const shareText = `${searchedName} - 
   Temperature: ${popupData.temp}°C,
   Humidity: ${popupData.humidity}%,
   Wind Speed: ${popupData.windSpeed} m/s,
   Clouds: ${popupData.clouds}%,
   Description: ${popupData.description}`;
  // محاولة نسخ النص إلى الحافظة
  try {
    await navigator.clipboard.writeText(shareText);
    showMessage('Text copied to clipboard!', 'info');
  } catch (error) {
    showMessage('Failed to copy text.', 'error');
  }
});
// إضافة جميع العناصر إلى البطاقة
  card.append(title, cover, tempText, humidityText, windText, cloudsText ,shareBtn );
  return card;
}
 // دالة لإظهار رسالة خطأ 
const messageBox = document.getElementById('message-box');
const spinner = document.getElementById('loader');
function showMessage(text, type) {
  messageBox.textContent = text;
  messageBox.classList.remove('error', 'info');
  messageBox.classList.add(type);
  messageBox.classList.add('visible');
}
  // دالة لإظهار الـ spinner
  function showSpinner() {
  spinner.classList.add('visible');
}
// دالة لإخفاء الـ spinner
function hideSpinner() {
  spinner.classList.remove('visible');
}

// دالة لإخفاء رسالة الخطأ 
function hideMessage() {
  messageBox.classList.remove('visible');
}
//

