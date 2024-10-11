// app/utils/location.js

// Function to get the user's location
export function obtenirUbicacio() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          reject(error);
        }
      );
    } else {
      reject(new Error('Geolocation is not supported by this browser.'));
    }
  });
}

// Function to calculate the distance between two coordinates
export function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distancia = R * c; // Distance in kilometers
  return distancia;
}

// Function to find the nearest municipality
export async function trobarMunicipiMesProper(ubicacio, municipis) {
  let municipiMesProper = null;
  let distMinima = Infinity;

  municipis.forEach((municipi) => {
    const { latitud, longitud } = municipi.coordenades;
    const distancia = calcularDistancia(
      ubicacio.latitude,
      ubicacio.longitude,
      latitud,
      longitud
    );

    if (distancia < distMinima) {
      distMinima = distancia;
      municipiMesProper = municipi;
    }
  });

  return municipiMesProper;
}
