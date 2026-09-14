import { projects } from '../../../../packages/world';
export const barrageExhibit = projects.find((p) => p.project_id === 'barrage')!.detailed_exhibit!;
export type BarrageControls = {
  focus: number;
  component: number;
  progress: number;
  weather: 'calm' | 'low' | 'high';
  future: boolean;
  low: boolean;
};
export const initialBarrage: BarrageControls = {
  focus: 0,
  component: 0,
  progress: 0,
  weather: 'calm',
  future: false,
  low: false,
};
export const barrageSection = (v: BarrageControls, mode: string) =>
  mode !== 'construction' && [4, 5, 7].includes(v.focus);
export function barrageOperation(v: BarrageControls, year: number) {
  const active = year >= 2026 && [4, 5].includes(v.focus);
  return { gateOpen: active && v.weather === 'low', pumping: active && v.weather === 'high' };
}
export function barrageRoleVisible(
  role: string,
  authored: number,
  v: BarrageControls,
  mode: string,
  stage: number,
  year: number,
) {
  if (!role) return !barrageSection(v, mode) && v.focus !== 2;
  if (year < 2026) return ['reservoir', 'sea', 'land'].includes(role);
  const section = barrageSection(v, mode);
  const sectionRole =
    role.startsWith('section-') ||
    ['pump-housing', 'shaft', 'impeller', 'motor', 'pump-flow-bed'].includes(role);
  if (sectionRole) return section && (v.focus !== 4 || role.startsWith('section-'));
  if (section) return false;
  if (['enclosure', 'temporary', 'work-water'].includes(role))
    return mode === 'construction' ? stage >= 1 && stage <= 2 && authored <= stage : v.focus === 2;
  if (v.focus === 2 && mode !== 'construction') return ['reservoir', 'sea'].includes(role);
  if (role === 'future') return mode === 'construction' ? stage === 8 : v.focus === 8 && v.future;
  const assembly =
    mode === 'construction' ? stage : v.focus === 3 ? 4 + Math.floor((v.progress * 3) / 101) : 7;
  return authored <= assembly;
}
const parts = [
  [1, 'reservoir', 0, [3, 2, -13]],
  [2, 'sea', 0, [3, 1, 13]],
  [3, 'gates', 4, [0, 5, 0]],
  [4, 'piers', 3, [9, 5, 0]],
  [5, 'bridge', 6, [16, 7, -2]],
  [6, 'hall', 5, [-32, 4, -8]],
  [7, 'pumps', 5, [-28, 5, 1]],
  [8, 'motor', 5, [20, 8, 0]],
  [9, 'roof', 6, [-28, 7, -12]],
  [10, 'enclosure', 1, [12, 6, 3]],
  [11, 'temporary', 2, [-10, 3, 7]],
  [12, 'future', 8, [12, 6, 0]],
] as const;
export function barrageLabels(v: BarrageControls, mode: string, stage: number, year: number) {
  if (year < 2026) return [];
  const section = barrageSection(v, mode);
  const allowed = mode === 'construction' ? null : barrageExhibit.stops[v.focus].component_ids;
  return parts.flatMap(([id, originalRole, authored, originalPosition]) => {
    const component = barrageExhibit.components[id - 1];
    if (allowed && !allowed.includes(component.id)) return [];
    let role: string = originalRole;
    let position: [number, number, number] = [...originalPosition];
    if (section) {
      const mapping: Record<number, [string, [number, number, number]]> = {
        1: ['section-reservoir', [0, 3, -7]],
        2: ['section-sea', [0, 1, 7]],
        3: ['section-gate', [0, 5, 0]],
        4: ['section-base', [6, 4, 0]],
        6: ['pump-housing', [23, 4, 0]],
        7: ['shaft', [20, 3, 0]],
        8: ['motor', [20, 8, 0]],
      };
      if (!mapping[id]) return [];
      [role, position] = mapping[id];
      if (id === 3 && barrageOperation(v, year).gateOpen) position = [0, 1, 4];
    }
    if (!barrageRoleVisible(role, authored, v, mode, stage, year)) return [];
    if (section && id === 2 && v.weather === 'high') position[1] += 3;
    if (v.focus === 3 && mode !== 'construction' && ['gates', 'pumps', 'bridge'].includes(role))
      position[1] += Math.max(0, 1 - ((v.progress / 100) * 3 - (authored - 4))) * 4;
    return [{ ...component, id, position }];
  });
}
