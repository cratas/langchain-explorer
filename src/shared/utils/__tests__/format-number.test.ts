import { describe, it, expect } from 'vitest';
import { fCurrency, fData, fNumber, fPercent, fShortenNumber } from '../format-number';

describe('fNumber - implementation detail', () => {
  it('formats numbers correctly', () => {
    expect(fNumber(123456)).toBe('123,456');
    expect(fNumber('123456')).toBe('123,456');
    expect(fNumber(null)).toBe('0');
  });
});

describe('fCurrency - implementation detail', () => {
  it('formats currency correctly', () => {
    expect(fCurrency(1234)).toBe('$1,234');
    expect(fCurrency('1234')).toBe('$1,234');
    expect(fCurrency(null)).toBe('');
  });
});

describe('fPercent - implementation detail', () => {
  it('formats percent correctly', () => {
    expect(fPercent(50)).toBe('50%');
    expect(fPercent('50')).toBe('50%');
    expect(fPercent(null)).toBe('');
  });
});

describe('fShortenNumber - implementation detail', () => {
  it('shortens numbers correctly', () => {
    expect(fShortenNumber(1234)).toBe('1.23k');
    expect(fShortenNumber('1234')).toBe('1.23k');
    expect(fShortenNumber(null)).toBe('');
  });
});

describe('fData - implementation detail', () => {
  it('formats data sizes correctly', () => {
    expect(fData(1024)).toBe('1 KB');
    expect(fData('1024')).toBe('1 KB');
    expect(fData(null)).toBe('');
  });
});
