export function resolveAsset(pathOrKey) {
  if (!pathOrKey) return null;

  if (
    pathOrKey.startsWith('http://') ||
    pathOrKey.startsWith('https://') ||
    pathOrKey.startsWith('//') ||
    pathOrKey.startsWith('data:')
  ) {
    return pathOrKey;
  }

  let clean = pathOrKey
    .replace(/^[./]+/, '')
    .replace(/^public\//, '')
    .replace(/^src\/assets\//, '');

  if (clean.startsWith('icons/')) {
    return `/images/${clean}`;
  }

  if (clean.startsWith('brand/')) {
    return `/images/${clean}`;
  }

  if (
    clean.startsWith('images/') ||
    clean.startsWith('videos/') ||
    clean.startsWith('video/') ||
    clean.startsWith('fonts/') ||
    clean.startsWith('favicon.')
  ) {
    return `/${clean}`;
  }

  return `/images/${clean}`;
}

export default resolveAsset;
