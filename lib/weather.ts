export type WeatherSummary = {
  tempF: number;
  condition: string;
  takeaway: string;
};

export async function fetchWeather(city: string): Promise<WeatherSummary | null> {
  if (!city?.trim()) return null;

  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city.trim())}&count=1`,
      { next: { revalidate: 3600 } }
    );
    const geo = await geoRes.json();
    const place = geo.results?.[0];
    if (!place) return null;

    const { latitude, longitude } = place;
    const wxRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`,
      { next: { revalidate: 1800 } }
    );
    const wx = await wxRes.json();
    const tempF = Math.round(wx.current?.temperature_2m ?? 70);
    const code = wx.current?.weather_code ?? 0;
    const condition = weatherCodeToLabel(code);
    const takeaway =
      code >= 51 && code <= 67
        ? "Bring an umbrella or rain jacket."
        : tempF < 45
          ? "Dress warm for the commute."
          : tempF > 85
            ? "Light layers—it's going to be hot."
            : "Comfortable conditions for the commute.";

    return { tempF, condition, takeaway };
  } catch (err) {
    console.warn("Weather fetch failed:", err);
    return null;
  }
}

function weatherCodeToLabel(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Rain showers";
  return "Variable";
}
