import { describe, expect, it } from 'vitest';
import { contentEngine } from '@/modules/content/ContentEngine';
import { loadCatalog } from '@/modules/content/loaders';

describe('esquemas de contenido', () => {
  const catalog = loadCatalog();

  it('carga todos los JSON sin lanzar', () => {
    expect(catalog.resources.length).toBeGreaterThan(100);
    expect(catalog.braille.glyphs.length).toBeGreaterThan(20);
  });

  it('tiene ids únicos', () => {
    const ids = catalog.resources.map((resource) => resource.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('no duplica order dentro de tipo y caja', () => {
    const seen = new Set<string>();
    for (const resource of catalog.resources) {
      const key = `${resource.type}:${resource.caseForm}:${resource.order}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });

  it('toda imagen tiene imageAlt', () => {
    for (const resource of catalog.resources) {
      if (resource.media.imageUrl) {
        expect(resource.media.imageAlt?.length).toBeGreaterThan(0);
      }
      for (const association of resource.associations) {
        expect(association.imageAlt.length).toBeGreaterThan(0);
      }
    }
  });

  it('toda relatedIds apunta a un id existente', () => {
    const ids = new Set(catalog.resources.map((resource) => resource.id));
    for (const resource of catalog.resources) {
      for (const relatedId of resource.relatedIds) {
        expect(ids.has(relatedId), `${resource.id} -> ${relatedId}`).toBe(true);
      }
    }
  });

  it('las 5 piezas del MVP tienen fiducialId único', () => {
    const mvp = contentEngine.getMvpResources();
    expect(mvp).toHaveLength(5);
    const fids = mvp.map((resource) => resource.vision.fiducialId);
    expect(fids.every((id) => typeof id === 'number')).toBe(true);
    expect(new Set(fids).size).toBe(5);
  });

  it('ningún recurso está marcado como validated', () => {
    expect(
      catalog.resources.every(
        (resource) => resource.validation === 'pending_validation',
      ),
    ).toBe(true);
  });
});
