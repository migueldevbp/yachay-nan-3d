import type {
  CaseForm,
  EducationalResource,
  ResourceType,
  ValidationSummary,
  Word,
  WordResource,
} from '@/types/content';

const MVP_CHARACTERS = new Set(['A', 'B', 'C', 'M', 'S']);

export function getById(
  resources: EducationalResource[],
  id: string,
): EducationalResource | undefined {
  return resources.find((resource) => resource.id === id);
}

export function getByType(
  resources: EducationalResource[],
  type: ResourceType,
): EducationalResource[] {
  return resources.filter((resource) => resource.type === type);
}

export function getByCharacter(
  resources: EducationalResource[],
  char: string,
  caseForm?: CaseForm,
): EducationalResource | undefined {
  const exact = resources.find((resource) => {
    if (resource.character !== char) {
      return false;
    }
    if (caseForm && resource.caseForm !== caseForm) {
      return false;
    }
    return true;
  });
  if (exact) {
    return exact;
  }

  return resources.find((resource) => {
    if (resource.character.toLowerCase() !== char.toLowerCase()) {
      return false;
    }
    if (caseForm && resource.caseForm !== caseForm) {
      return false;
    }
    return true;
  });
}

export function getByModelClass(
  resources: EducationalResource[],
  modelClass: string,
): EducationalResource | undefined {
  return resources.find(
    (resource) => resource.vision.modelClass === modelClass,
  );
}

export function getSequence(
  resources: EducationalResource[],
  type: ResourceType,
): EducationalResource[] {
  return getByType(resources, type)
    .slice()
    .sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return a.caseForm.localeCompare(b.caseForm);
    });
}

export function getMvpResources(
  resources: EducationalResource[],
): EducationalResource[] {
  return resources
    .filter(
      (resource) =>
        resource.type === 'letter' &&
        resource.caseForm === 'uppercase' &&
        resource.vision.hasPhysicalPiece &&
        MVP_CHARACTERS.has(resource.character),
    )
    .sort((a, b) => a.character.localeCompare(b.character));
}

function consumePieces(required: string[], available: string[]): boolean {
  const pool = available.map((piece) => piece.toUpperCase());
  for (const piece of required) {
    const index = pool.indexOf(piece.toUpperCase());
    if (index < 0) {
      return false;
    }
    pool.splice(index, 1);
  }
  return true;
}

export function getWordsFormableWith(
  words: WordResource[],
  chars: string[],
): Word[] {
  return words.filter((word) => consumePieces(word.requiredPieces, chars));
}

export function getRelated(
  resources: EducationalResource[],
  id: string,
): EducationalResource[] {
  const resource = getById(resources, id);
  if (!resource) {
    return [];
  }
  return resource.relatedIds
    .map((relatedId) => getById(resources, relatedId))
    .filter((item): item is EducationalResource => item !== undefined);
}

export function getValidationSummary(
  resources: EducationalResource[],
): ValidationSummary {
  return resources.reduce<ValidationSummary>(
    (summary, resource) => {
      if (resource.validation === 'validated') {
        summary.validated += 1;
      } else if (resource.validation === 'draft') {
        summary.draft += 1;
      } else {
        summary.pending += 1;
      }
      return summary;
    },
    { validated: 0, pending: 0, draft: 0 },
  );
}
