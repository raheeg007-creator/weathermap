const API_KEY = '868ff817f39bfd9eca2e584bd870a1de';
const map = L.map('map').setView([15.5007, 32.5599], 6);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const formWeather = document.getElementById('search-form');
const inputCity = document.getElementById('city-input');
formWeather.addEventListener('submit',async function (event) {
   // منع الصفحة من إعادة التحميل
  event.preventDefault();
    // قراءة اسم المدينة وحذف المسافات الزائدة
  const city = inputCity.value.trim();
    // الإيقاف إذا كان الحقل فارغ
  if (city === '') {
   return;
 }

 // تجربة الطلبين بالتتابع مع التقاط أي خطأ
 try {
    // الطلب الأول: الحصول على الإحداثيات
    const cityCoordinates = await getCityCoordinates(city);
      // إيقاف التنفيذ إذا لم توجد المدينة
    if (cityCoordinates === null) {
      console.log('City not found');
      return;
    }
  // الطلب الثاني: الحصول على الطقس بعد نجاح الأول
    const weatherData = await getWeatherData(cityCoordinates);
    console.log(weatherData);
      // طباعة الخطأ في الـ Console
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
});

  // دالة تحوّل اسم المدينة إلى إحداثيات باستخدام Nominatim

 async function getCityCoordinates(cityName) {
  // بناء رابط البحث مع تشفير اسم المدينة لتفادي مشاكل المسافات والحروف العربية
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(cityName)}`;
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






