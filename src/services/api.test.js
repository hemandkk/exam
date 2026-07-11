import { getStoredToken, persistAuthToken, clearAuthToken } from './api';

describe('auth token helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('reads a legacy token and persists it in the new storage key', () => {
    localStorage.setItem('token', 'legacy-token');

    expect(getStoredToken()).toBe('legacy-token');
    expect(localStorage.getItem('access_token')).toBe('legacy-token');
  });

  it('persists and clears auth tokens consistently', () => {
    persistAuthToken('new-token');

    expect(getStoredToken()).toBe('new-token');
    expect(localStorage.getItem('access_token')).toBe('new-token');
    expect(localStorage.getItem('token')).toBe('new-token');

    clearAuthToken();

    expect(getStoredToken()).toBeNull();
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
