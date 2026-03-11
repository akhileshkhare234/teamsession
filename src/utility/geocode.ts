// src/utils/reverseGeocode.ts
export const reverseGeocode = async (
  lat: number,
  lon: number
): Promise<string> => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.display_name || "Address not found";
};
