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

const FALLBACK_WEATHER: WeatherData = {
  temp: 28,
  humidity: 48,
  windSpeed: 8,
  conditionEn: 'Pleasant Pune Weather',
  conditionMr: 'आल्हाददायक पुणेरी हवामान',
  icon: '🌤️',
  adviceEn: 'Optimal hours for outdoor sightseeing',
  adviceMr: 'बाहेरील पर्यटनासाठी उत्तम वेळ',
};

export default function WeatherWidget() {
  const { isMr } = useLanguage();
  const [weather, setWeather] = useState<WeatherData>(FALLBACK_WEATHER);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. Immediately provide fallback for search crawlers & bots without issuing outbound XHR
    const isBot =
      typeof navigator !== 'undefined' &&
      (navigator.webdriver ||
        /bot|googlebot|crawler|spider|robot|crawling|lighthouse|headlesschrome|ptst/i.test(
          navigator.userAgent
        ));
    if (isBot) {
      return;
    }

    // 2. Check session cache
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

    // 3. Fetch from internal same-origin cached API route
    async function fetchWeather() {
      try {
        const res = await fetch('/api/v1/weather');
        if (!res.ok) throw new Error('Weather API error');
        const data: WeatherData = await res.json();

        setWeather(data);
        sessionStorage.setItem(
          'pune_live_weather_v1',
          JSON.stringify({ timestamp: Date.now(), data })
        );
      } catch {
        setWeather(FALLBACK_WEATHER);
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
