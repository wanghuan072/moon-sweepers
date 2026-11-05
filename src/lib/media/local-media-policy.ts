export function permitsLocalMedia(mode: string | undefined) { return mode === 'development'; }
export function permittedMediaId(id: string, sourceIds: string[]) {
  return /^(?:steam-screenshot-\d+|reference-(?:equipment|content|map)-[a-z0-9-]+)(?:-thumb)?$/.test(id) && sourceIds.includes(id.replace(/-thumb$/, ''));
}
