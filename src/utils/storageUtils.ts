/**
 * Safely retrieves an item from localStorage with error handling
 * @param key The localStorage key
 * @returns The stored value or null if not found or error occurred
 */
export function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Failed to get item from localStorage (key: ${key}):`, error);
    return null;
  }
}

/**
 * Safely sets an item in localStorage with error handling
 * @param key The localStorage key
 * @param value The value to store
 * @returns True if successful, false otherwise
 */
export function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Failed to set item in localStorage (key: ${key}):`, error);
    // Check if quota exceeded
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('LocalStorage quota exceeded. Consider clearing old data.');
    }
    return false;
  }
}

/**
 * Safely removes an item from localStorage with error handling
 * @param key The localStorage key
 * @returns True if successful, false otherwise
 */
export function safeRemoveItem(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(
      `Failed to remove item from localStorage (key: ${key}):`,
      error
    );
    return false;
  }
}

/**
 * Safely parses JSON from localStorage
 * @param key The localStorage key
 * @param defaultValue The default value to return if parsing fails
 * @returns The parsed JSON or default value
 */
export function safeGetJSON<T>(key: string, defaultValue: T): T {
  const item = safeGetItem(key);
  if (item === null) {
    return defaultValue;
  }

  try {
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(
      `Failed to parse JSON from localStorage (key: ${key}):`,
      error
    );
    return defaultValue;
  }
}

/**
 * Safely stores JSON in localStorage
 * @param key The localStorage key
 * @param value The value to stringify and store
 * @returns True if successful, false otherwise
 */
export function safeSetJSON<T>(key: string, value: T): boolean {
  try {
    const jsonString = JSON.stringify(value);
    return safeSetItem(key, jsonString);
  } catch (error) {
    console.error(
      `Failed to stringify and save to localStorage (key: ${key}):`,
      error
    );
    return false;
  }
}
