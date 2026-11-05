import type { Entry } from "./content";
export interface Machine extends Entry {
  role: string; input: string; output: string; cost: number | null;
  power: number | null; cycle: number | null; unlock: string | null;
  costUnit?: 'machine' | 'metre'; powerMode?: 'consumer' | 'generator' | 'not-listed';
  powerOutput?: number; battery?: number; range?: number; storage?: number;
  footprint?: string; height?: number;
  recipe?: { inputs: { material: string; amount: number }[]; outputMaterial: string; outputKg: number; basePrice: number };
}
