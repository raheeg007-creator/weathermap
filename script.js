const map = L.map('map').setView([15.5007, 32.5599], 6);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const formWeather = document.getElementById('search-form');
const inputCity = document.getElementById('city-input');
formWeather.addEventListener('submit', function (event) {
   // منع الصفحة من إعادة التحميل
  event.preventDefault();
    // قراءة اسم المدينة وحذف المسافات الزائدة
  const city = inputCity.value.trim();
    // الإيقاف إذا كان الحقل فارغ
  if (city === '') {
   return;
 }
  console.log(city);
 });
 