import { projects } from '../../../../packages/world';
export const mrtExhibit = projects.find((p) => p.project_id === 'mrt')!.detailed_exhibit!;
export type MrtControls = {
  focus: number;
  component: number;
  progress: number;
  method: 'top-down' | 'bottom-up';
  low: boolean;
};
export const initialMrt: MrtControls = {
  focus: 0,
  component: 1,
  progress: 0,
  method: 'top-down',
  low: false,
};
export function mrtStage(v: MrtControls, mode: string, stage: number) {
  if (mode === 'construction') return stage;
  return [8, 8, 0, 1, Math.min(8, Math.floor((v.progress * 9) / 101)), 6, 4, 8, 8][v.focus];
}
export function mrtRoleVisible(
  role: string,
  authored: number,
  v: MrtControls,
  mode: string,
  stage: number,
  year: number,
) {
  if (year < 2026) return ['ground', 'street', 'street-detail', ''].includes(role);
  if (v.focus === 7 && mode !== 'construction')
    return (
      (role.startsWith('freeze-') || role === 'ice' || role === '') &&
      !(v.progress >= 80 && ['freeze-pipes', 'ice'].includes(role))
    );
  if (role.startsWith('freeze-') || role === 'ice') return false;
  const s = mrtStage(v, mode, stage);
  if (v.focus === 5 && mode !== 'construction') {
    if (role === 'rings') return v.progress > 20;
    if (role === 'grout') return v.progress > 50;
  }
  if (role === 'constraints') return v.focus === 2;
  if (role === 'panel') return v.focus === 3;
  if (role === 'cage') return v.focus === 3 && v.progress >= 34 && v.progress < 67;
  if (role === 'wall' && v.focus === 3) return false;
  if (role === 'braces') return s >= 2 && s <= 5;
  if (role === 'excavation') return s >= 1 && s < 5;
  if (role === 'opening') return s >= 3 && s < 8;
  if (['tbm', 'cutter', 'conveyor', 'grout', 'segment'].includes(role)) return s === 6;
  if (role === 'monitor') return s >= 1 && s < 8;
  if (v.method === 'bottom-up' && (mode === 'construction' || v.focus === 4)) {
    if (role === 'roof') return s >= 5;
    if (role === 'floor' || role === 'stairs') return s >= 4;
    if (role === 'base') return s >= 3;
  }
  return authored <= s;
}
const labels = [
  [1, 'access', 8, [-16, 28, -1]],
  [2, 'wall', 1, [-24, 17, 3]],
  [3, 'braces', 2, [-8, 19, 5]],
  [4, 'floor', 4, [-8, 15, -2]],
  [5, 'opening', 3, [-3, 25, 0]],
  [6, 'tbm', 6, [29, 8, 6]],
  [7, 'conveyor', 6, [23, 2, 8]],
  [8, 'rings', 6, [15, 7, 6]],
  [9, 'grout', 6, [18, 3, 6]],
  [10, 'monitor', 6, [-21, 23, 9]],
  [11, 'freeze-pipes', 8, [0, 15, 4]],
  [12, 'rail', 7, [-8, 3, 6]],
] as const;
export function mrtLabels(v: MrtControls, mode: string, stage: number, year: number) {
  return labels
    .filter(([, role, s]) =>
      mrtRoleVisible(role === 'wall' && v.focus === 3 ? 'panel' : role, s, v, mode, stage, year),
    )
    .map(([id, role, s, position]) => ({
      ...mrtExhibit.components[id - 1],
      id,
      role,
      stage: s,
      position: [...position] as [number, number, number],
    }));
}
