import { loadCatalog, type ContentCatalog } from '@/modules/content/loaders';
import {
  getByCharacter as queryByCharacter,
  getById as queryById,
  getByModelClass as queryByModelClass,
  getByType as queryByType,
  getMvpResources as queryMvp,
  getRelated as queryRelated,
  getSequence as querySequence,
  getValidationSummary as querySummary,
  getWordsFormableWith as queryWordsFormable,
} from '@/modules/content/queries';
import type {
  CaseForm,
  EducationalResource,
  ResourceType,
  ValidationSummary,
  Word,
} from '@/types/content';

export class ContentEngine {
  private readonly catalog: ContentCatalog;

  constructor(catalog: ContentCatalog = loadCatalog()) {
    this.catalog = catalog;
  }

  getById(id: string): EducationalResource | undefined {
    return queryById(this.catalog.resources, id);
  }

  getByType(type: ResourceType): EducationalResource[] {
    return queryByType(this.catalog.resources, type);
  }

  getByCharacter(
    char: string,
    caseForm?: CaseForm,
  ): EducationalResource | undefined {
    return queryByCharacter(this.catalog.resources, char, caseForm);
  }

  getByModelClass(modelClass: string): EducationalResource | undefined {
    return queryByModelClass(this.catalog.resources, modelClass);
  }

  getSequence(type: ResourceType): EducationalResource[] {
    return querySequence(this.catalog.resources, type);
  }

  getMvpResources(): EducationalResource[] {
    return queryMvp(this.catalog.resources);
  }

  getWordsFormableWith(chars: string[]): Word[] {
    return queryWordsFormable(this.catalog.words, chars);
  }

  getRelated(id: string): EducationalResource[] {
    return queryRelated(this.catalog.resources, id);
  }

  getValidationSummary(): ValidationSummary {
    return querySummary(this.catalog.resources);
  }

  getAll(): EducationalResource[] {
    return this.catalog.resources;
  }

  getBrailleTable() {
    return this.catalog.braille;
  }
}

export const contentEngine = new ContentEngine();
