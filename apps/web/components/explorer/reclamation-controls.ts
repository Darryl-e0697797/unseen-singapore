import { projects } from '../../../../packages/world';
export const reclamationExhibit = projects.find(
  (p) => p.project_id === 'reclamation',
)!.detailed_exhibit!;
export type ReclamationControls = {
  focus: number;
  component: number;
  progress: number;
  weather: 'dry' | 'wet';
  future: boolean;
  comparison: boolean;
  low: boolean;
};
export const initialReclamation: ReclamationControls = {
  focus: 0,
  component: 0,
  progress: 0,
  weather: 'dry',
  future: false,
  comparison: false,
  low: false,
};
export function reclamationOperation(v: ReclamationControls, year: number) {
  const active = year >= 2026 && [5, 6].includes(v.focus);
  return { circulation: active && v.weather === 'dry', discharge: active && v.weather === 'wet' };
}
export function reclamationRoleVisible(
  role: string,
  authored: number,
  v: ReclamationControls,
  mode: string,
  stage: number,
  year: number,
) {
  if (year < 2026) return false;
  const building = mode === 'construction';
  if (role === 'future') return building ? stage === 8 : v.focus === 8 && v.future;
  if (role === 'comparison') return !building && v.focus === 1 && v.comparison;
  if (['enclosure', 'workwater'].includes(role))
    return building ? stage === 1 || stage === 2 : v.focus === 3 && v.progress < 80;
  if (['surcharge', 'ground'].includes(role)) return building ? stage === 4 : v.focus === 2;
  if (building) return authored <= stage;
  if (v.focus === 3)
    return (
      ['', 'sea', 'land'].includes(role) ||
      (role === 'outlet' && v.progress >= 35) ||
      (['dike', 'rock', 'wall', 'grass'].includes(role) && v.progress >= 70)
    );
  if (v.focus === 2) return ['', 'land', 'surface'].includes(role);
  if (v.focus === 4)
    return ['', 'land', 'sea', 'dike', 'rock', 'grass', 'wall', 'seepage'].includes(role);
  if (v.focus === 1 && v.comparison) return ['', 'sea', 'land'].includes(role);
  return true;
}
const parts: [string, number, [number, number, number]][] = [
  ['sea', 0, [-27, 2, 8]],
  ['land', 0, [8, 0.5, 8]],
  ['dike', 3, [-12, 7, -12]],
  ['rock', 3, [-18, 3, 9]],
  ['grass', 3, [-7, 3, -7]],
  ['wall', 3, [-12, 5, 0]],
  ['seepage', 3, [-2, 1, 13]],
  ['drains', 5, [7, 1, 11]],
  ['pond', 5, [22, 1, -5]],
  ['central', 6, [14, 4, 7]],
  ['discharge', 6, [-5, 4, -9]],
  ['outlet', 2, [-19, 2, 0]],
  ['enclosure', 1, [-4, 5, 6]],
  ['ground', 4, [8, 5, 0]],
];
export function reclamationLabels(
  v: ReclamationControls,
  mode: string,
  stage: number,
  year: number,
) {
  const allowed = mode === 'construction' ? null : reclamationExhibit.stops[v.focus].component_ids;
  return parts.flatMap(([role, s, pos], i) => {
    const c = reclamationExhibit.components[i];
    if (
      (allowed && !allowed.includes(c.id)) ||
      !reclamationRoleVisible(role, s, v, mode, stage, year)
    )
      return [];
    const position: [number, number, number] = [...pos];
    if (mode !== 'construction' && v.focus === 4 && ['rock', 'grass'].includes(role))
      position[0] += (role === 'rock' ? -1 : 1) * v.progress * 0.06;
    return [{ ...c, id: i + 1, position }];
  });
}
