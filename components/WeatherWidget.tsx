'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  conditionEn: string;
  conditionMr: string;
  icon: string;
  adviceEn: string;
  adviceMr: string;
}

export default function WeatherWidget() {
  const { isMr } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session cache first
    try {
      const cached = sessionStorage.getItem('pune_live_weather_v1');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < 15 * 60 * 1000) {
          // Valid 15 min cache
          setWeather(parsed.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    async function fetchWeather() {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=18.5204&longitude=73.8567&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m'
        );
        if (!res.ok) throw new Error('Weather API error');
        const json = await res.json();
        const cur = json.current;

        const code = cur.weather_code ?? 0;
        let conditionEn = 'Clear & Pleasant';
        let conditionMr = 'निरभ्र व आल्हाददायक';
        let icon = '☀️';
        let adviceEn = 'Great for forts, wadas & open-air tekdi walks';
        let adviceMr = 'किल्ले, वाडे आणि टेकडी भ्रमंतीसाठी उत्तम वेळ';

        if (code === 0) {
          conditionEn = 'Clear Skies';
          conditionMr = 'स्वच्छ सूर्यप्रकाश';
          icon = '☀️';
        } else if (code >= 1 && code <= 3) {
          conditionEn = 'Partly Cloudy';
          conditionMr = 'हलके ढगाळ वातावरण';
          icon = '🌤️';
          adviceEn = 'Pleasant breeze — ideal for heritage photo walks';
          adviceMr = 'थंडगार वारा — ऐतिहासिक छायाचित्रांसाठी उत्तम काळ';
        } else if (code >= 45 && code <= 48) {
          conditionEn = 'Morning Mist / Fog';
          conditionMr = 'सकाळचे धुके';
          icon = '🌫️';
          adviceEn = 'Scenic Sahyadri views; drive carefully on ghats';
          adviceMr = 'सह्याद्रीचे नयनरम्य दृश्य; घाटात सावकाश गाडी चालवा';
        } else if (code >= 51 && code <= 67) {
          conditionEn = 'Light Monsoon Showers';
          conditionMr = 'हलक्या पावसाच्या सरी';
          icon = '🌦️';
          adviceEn = 'Carry an umbrella & trekking shoes with grip';
          adviceMr = 'छत्री व मजबूत पकडीचे बूट सोबत ठेवा';
        } else if (code >= 80 && code <= 99) {
          conditionEn = 'Passing Rain / Gusts';
          conditionMr = 'पावसाच्या जोरदार सरी';
          icon = '🌧️';
          adviceEn = 'Enjoy indoor museums, wadas & piping hot Misal';
          adviceMr = 'वाडे, वस्तुसंग्रहालये पहा आणि गरमागरम मिसळचा आनंद घ्या';
        }

        const data: WeatherData = {
          temp: Math.round(cur.temperature_2m),
          humidity: cur.relative_humidity_2m,
          windSpeed: Math.round(cur.wind_speed_10m),
          conditionEn,
          conditionMr,
          icon,
          adviceEn,
          adviceMr,
        };

        setWeather(data);
        sessionStorage.setItem(
          'pune_live_weather_v1',
          JSON.stringify({ timestamp: Date.now(), data })
        );
      } catch {
        // Fallback realistic Pune weather
        setWeather({
          temp: 28,
          humidity: 48,
          windSpeed: 8,
          conditionEn: 'Pleasant Pune Weather',
          conditionMr: 'आल्हाददायक पुणेरी हवामान',
          icon: '🌤️',
          adviceEn: 'Optimal hours for outdoor sightseeing',
          adviceMr: 'बाहेरील पर्यटनासाठी उत्तम वेळ',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  if (loading && !weather) {
    return (
      <div
        className="weather-pill-skeleton"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 14px',
          background: 'rgba(255,255,255,0.7)',
          borderRadius: 'var(--radius-full)',
          fontSize: '12px',
          color: 'var(--muted)',
          border: '1px solid var(--line)',
        }}
      >
        <span>🌤️</span> {isMr ? 'पुणे हवामान लोड होत आहे…' : 'Loading Pune Weather…'}
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div
      className="weather-widget-badge"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        padding: '7px 16px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid #cbd5e1',
        borderRadius: 'var(--radius-full)',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
        fontSize: '12.5px',
        color: 'var(--ink)',
        flexWrap: 'wrap',
      }}
      title={isMr ? weather.adviceMr : weather.adviceEn}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
        <span style={{ fontSize: '16px' }}>{weather.icon}</span>
        <span style={{ color: '#065f46' }}>Pune {weather.temp}°C</span>
      </div>

      <span style={{ color: 'var(--line)', display: 'inline-block' }}>|</span>

      <span style={{ color: 'var(--ink-secondary)', fontWeight: 500 }}>
        {isMr ? weather.conditionMr : weather.conditionEn}
      </span>

      <span style={{ color: 'var(--line)', display: 'inline-block' }}>|</span>

      <span style={{ color: 'var(--muted)', fontSize: '11.5px', fontWeight: 600 }}>
        💨 {weather.windSpeed} km/h • 💧 {weather.humidity}%
      </span>

      <span
        style={{
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          fontWeight: 700,
          fontSize: '11px',
          padding: '2px 8px',
          borderRadius: '999px',
          border: '1px solid var(--primary-border)',
        }}
      >
        ✨ {isMr ? weather.adviceMr : weather.adviceEn}
      </span>
    </div>
  );
}
