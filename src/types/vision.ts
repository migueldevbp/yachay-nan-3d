export interface VisionSpec {
  modelClass: string;
  fiducialId?: number;
  minConfidence: number;
  hasPhysicalPiece: boolean;
}
