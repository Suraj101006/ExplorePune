import { describe, it, expect } from 'vitest';
import {
  findPlaceInQuery,
  resolveLocalKnowledge,
} from '../lib/chatKnowledgeEngine';

describe('chatKnowledgeEngine', () => {
  describe('findPlaceInQuery', () => {
    it('finds place by English name', () => {
      const p = findPlaceInQuery('Tell me about Shaniwar Wada in Pune');
      expect(p).not.toBeNull();
      expect(p?.slug).toBe('shaniwar-wada');
    });

    it('finds place by Marathi name or alias', () => {
      const p = findPlaceInQuery('सिंहगड किल्ल्याबद्दल माहिती सांगा');
      expect(p).not.toBeNull();
      expect(p?.slug).toBe('sinhagad-fort');
    });

    it('resolves pronouns using conversation context', () => {
      const p = findPlaceInQuery('What are its timings and how much is it?', {
        lastReferencedSlug: 'aga-khan-palace',
      });
      expect(p).not.toBeNull();
      expect(p?.slug).toBe('aga-khan-palace');
    });
  });

  describe('resolveLocalKnowledge - Categories', () => {
    it('answers best forts queries with structured cards', () => {
      const res = resolveLocalKnowledge('What are the best forts to visit in Pune?');
      expect(res.handled).toBe(true);
      expect(res.reply).toContain('Best Forts');
      expect(res.places).toBeDefined();
      expect(res.places!.length).toBeGreaterThan(0);
      expect(res.places![0].category_slug).toBe('forts');
    });

    it('answers heritage wadas queries', () => {
      const res = resolveLocalKnowledge('Historic heritage wadas in Pune');
      expect(res.handled).toBe(true);
      expect(res.reply).toContain('Heritage');
      expect(res.places).toBeDefined();
    });

    it('answers religious temples queries', () => {
      const res = resolveLocalKnowledge('Famous temples and religious places in Pune');
      expect(res.handled).toBe(true);
      expect(res.reply).toContain('Temples');
    });

    it('answers nature spots queries', () => {
      const res = resolveLocalKnowledge('Nature spots, lakes and hills');
      expect(res.handled).toBe(true);
      expect(res.reply).toContain('Nature');
    });

    it('answers family friendly places queries', () => {
      const res = resolveLocalKnowledge('Places to visit with family and kids');
      expect(res.handled).toBe(true);
      expect(res.reply).toContain('Family');
    });

    it('answers short visit under 1 hour queries', () => {
      const res = resolveLocalKnowledge('Places for a quick short visit');
      expect(res.handled).toBe(true);
      expect(res.reply).toContain('Short Visit');
    });
  });

  describe('resolveLocalKnowledge - Place Details & Anti-Hallucination', () => {
    it('returns verified entry fee and official source without hallucination', () => {
      const res = resolveLocalKnowledge('What is the entry fee for Shaniwar Wada?');
      expect(res.handled).toBe(true);
      expect(res.reply).toContain('Verified');
      expect(res.reply).toContain('/places/shaniwar-wada');
      expect(res.places).toBeDefined();
    });

    it('distinguishes verified free entry places', () => {
      const res = resolveLocalKnowledge('Is Pataleshwar Cave Temple free?');
      expect(res.handled).toBe(true);
      expect(res.reply).toContain('Free');
    });

    it('provides verified operating timings', () => {
      const res = resolveLocalKnowledge('What are the opening hours of Aga Khan Palace?');
      expect(res.handled).toBe(true);
      expect(res.reply).toContain('Timings');
      expect(res.reply).toContain('/places/aga-khan-palace');
    });

    it('provides best time to visit', () => {
      const res = resolveLocalKnowledge('Best time to visit Sinhagad Fort');
      expect(res.handled).toBe(true);
      expect(res.reply).toContain('Best Time to Visit');
    });

    it('provides public transit route directions', () => {
      const res = resolveLocalKnowledge('How to reach Shaniwar Wada by metro or bus?');
      expect(res.handled).toBe(true);
      expect(res.reply).toContain('Transit');
      expect(res.transit).toBeDefined();
    });
  });

  describe('resolveLocalKnowledge - Trip Planning Integration', () => {
    it('generates a 4-hour plan and provides Trip Planner payload', () => {
      const res = resolveLocalKnowledge('I have 4 hours in Pune, plan my trip');
      expect(res.handled).toBe(true);
      expect(res.planPayload).toBeDefined();
      expect(res.planPayload?.hours).toBe(4);
      expect(res.planPayload?.slugs.length).toBeGreaterThan(1);
      expect(res.reply).toContain('Trip Planner');
    });

    it('generates full day plan for 7 hours', () => {
      const res = resolveLocalKnowledge('Plan a 1-day itinerary for Pune');
      expect(res.handled).toBe(true);
      expect(res.planPayload).toBeDefined();
      expect(res.planPayload?.slugs).toContain('sinhagad-fort');
    });
  });

  describe('resolveLocalKnowledge - Marathi (मराठी) Fluency', () => {
    it('responds in natural Marathi when query is in Devanagari', () => {
      const res = resolveLocalKnowledge('पुण्यातील किल्ले कोणते आहेत?');
      expect(res.handled).toBe(true);
      expect(res.reply).toContain('किल्ले');
      expect(res.suggestions).toBeDefined();
    });

    it('provides Marathi entry fee details', () => {
      const res = resolveLocalKnowledge('शनिवार वाड्याचे तिकीट किती आहे?');
      expect(res.handled).toBe(true);
      expect(res.reply).toContain('प्रवेश शुल्क');
    });
  });
});
