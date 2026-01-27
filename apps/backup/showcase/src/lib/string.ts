const cache: Record<string, string> = {};

/**
 * Converts a hyphen-separated string to Title Case.
 * Example: 'alert-dialog' -> 'Alert Dialog'
 * 
 * Includes simple memoization to prevent redundant processing.
 */
export function toOptions(name: string | undefined): string {
    if (!name) return '';

    if (cache[name]) {
        return cache[name];
    }

    const title = name
        .split('-')
        .map((str) => str.replace(/\b\w/g, (char) => char.toUpperCase()))
        .join(' ');

    cache[name] = title;
    return title;
}
