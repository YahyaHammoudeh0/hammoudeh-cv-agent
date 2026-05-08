const headModules = import.meta.glob('../assets/robot/head/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const bodyModules = import.meta.glob('../assets/robot/body/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const handsModules = import.meta.glob('../assets/robot/hands/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const accessoryModules = import.meta.glob('../assets/robot/accessories/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

const sortedUrls = (modules: Record<string, string>): string[] =>
  Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, url]) => url);

export const headFrames = sortedUrls(headModules);
export const bodyFrames = sortedUrls(bodyModules);
export const handsFrames = sortedUrls(handsModules);
export const accessoryFrames = accessoryModules;

// Frame indices are 0-based; PNGs are named 0001..0020 → array index = frameNumber - 1.
export const frame = (n: number) => n - 1;
