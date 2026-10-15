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
  try{
  const cityCoordinates = await getCityCoordinates(city);
  console.log(cityCoordinates);
 } catch (error) {
  console.error('Unable to find city coordinates:', error);
 }
 });

 async function getCityCoordinates(cityName) {
  // 1. ابني الرابط
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(cityName)}`;
  // 2. fetch
  const response = await fetch(url);

  // 3. تأكدي من response.ok
 if (!response.ok) {
    throw new Error('Request failed');
  }

  // 4. حولي الرد لـ JSON
  const data = await response.json();

  // 5. لو المصفوفة فاضية، ارجعي بـ null
  if (data.length === 0) {
    return null;
  }

  // 6. ارجعي بـ lat و lon كأرقام
  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon)
  };
}





