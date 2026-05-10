export type RoadmapColumn = "now" | "next" | "later";
export type RoadmapStatus = "planned" | "in-progress" | "done";

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: RoadmapStatus;
  column: RoadmapColumn;
  targetTimeframe: string;
  owner: string;
  team: string;
  createdAt: string;
  updatedAt: string;
}

export type RoadmapData = RoadmapItem[];

export interface UpsertItemParams {
  id?: string;
  title: string;
  description: string;
  status: RoadmapStatus;
  column: RoadmapColumn;
  targetTimeframe: string;
  owner: string;
  team: string;
}

export interface DeleteItemParams {
  id: string;
}

export interface MoveItemParams {
  id: string;
  column: RoadmapColumn;
}
