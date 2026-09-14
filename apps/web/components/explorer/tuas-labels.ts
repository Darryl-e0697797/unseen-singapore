import type { TuasControls } from './tuas-journey';
type Point = [number, number, number];
export type TuasLabel = {
  id: number;
  name: string;
  purpose: string;
  focus: number;
  stage: number;
  claim: string;
  anchor: Point;
  position: Point;
};
// Original drawing annotations. Positions identify schematic meshes, not surveyed coordinates.
export const tuasLabels: TuasLabel[] = [
  {
    id: 1,
    name: 'Container ship',
    purpose: 'Brings containers to the port and carries them onwards by sea.',
    focus: 0,
    stage: 8,
    claim: 'tuas-automation',
    anchor: [-17, 13, 13],
    position: [-24, 19, 19],
  },
  {
    id: 2,
    name: 'Quay crane',
    purpose:
      'Lifts containers between the ship and the land. “Quay” means the waterfront where a ship berths.',
    focus: 6,
    stage: 7,
    claim: 'tuas-automation',
    anchor: [-12, 26, 0],
    position: [-15, 32, 0],
  },
  {
    id: 3,
    name: 'Container yard',
    purpose: 'Holds containers between journeys. The yard crane moves them into and out of stacks.',
    focus: 6,
    stage: 8,
    claim: 'tuas-automation',
    anchor: [12, 16, -12],
    position: [19, 23, -15],
  },
  {
    id: 4,
    name: 'Caisson · concrete wall',
    purpose:
      'A large hollow concrete unit forms the waterfront wall. It holds the reclaimed ground in place and supports the berthing structure.',
    focus: 4,
    stage: 4,
    claim: 'tuas-caisson-function',
    anchor: [7, 10, 5],
    position: [21, 13, 9],
  },
  {
    id: 5,
    name: 'Reclamation fill',
    purpose:
      'Material placed behind the wall creates new ground for the terminal. It needs treatment before it can support demanding port operations.',
    focus: 5,
    stage: 5,
    claim: 'tuas-reused-fill',
    anchor: [18, 7, -12],
    position: [24, 10, -17],
  },
  {
    id: 6,
    name: 'Prepared foundation',
    purpose:
      'Prepared ground and a rock mound support the concrete wall. Soft ground was replaced locally where needed; this is not one uniform foundation for the whole port.',
    focus: 2,
    stage: 1,
    claim: 'tuas-foundation',
    anchor: [12, 2, 5],
    position: [20, 6, 13],
  },
  {
    id: 7,
    name: 'Caisson casting bay',
    purpose:
      'The concrete unit is made on land before its journey to the sea. The internal walls shown here are simplified.',
    focus: 3,
    stage: 2,
    claim: 'tuas-slipform',
    anchor: [-25, 11, -11],
    position: [-32, 18, -16],
  },
  {
    id: 8,
    name: 'Floating caisson',
    purpose:
      'This concrete unit is towed to its position, then lowered onto the prepared foundation. The animation does not show a real ballast procedure.',
    focus: 4,
    stage: 3,
    claim: 'tuas-float-place',
    anchor: [-14, 14, 11],
    position: [-12, 20, 15],
  },
  {
    id: 9,
    name: 'Vertical drains',
    purpose:
      'These drainage paths help water escape from soft ground under a temporary load, allowing the ground to settle and become more stable.',
    focus: 5,
    stage: 6,
    claim: 'tuas-drains',
    anchor: [12, 7, -7],
    position: [24, 7, -4],
  },
  {
    id: 10,
    name: 'Temporary load · surcharge',
    purpose:
      'Extra material presses on the ground during treatment. It is temporary, not part of the finished terminal.',
    focus: 5,
    stage: 6,
    claim: 'tuas-drains',
    anchor: [8, 15, -10],
    position: [4, 20, -16],
  },
  {
    id: 11,
    name: 'Driverless carrier · AGV',
    purpose:
      'An automated guided vehicle carries containers between the quay and the yard. The movement here is a teaching example, not real traffic control.',
    focus: 6,
    stage: 8,
    claim: 'tuas-automation',
    anchor: [7, 13, -2],
    position: [18, 17, 3],
  },
  {
    id: 12,
    name: 'Rising mould · slipform',
    purpose:
      'Formwork shapes the concrete as the caisson walls are built upwards. Move the slider to see the mould rise.',
    focus: 3,
    stage: 2,
    claim: 'tuas-slipform',
    anchor: [-25, 10, -6],
    position: [-16, 15, 1],
  },
  {
    id: 13,
    name: 'Tug',
    purpose:
      'A small working vessel tows the floating concrete unit towards its installation area. Vessel size and arrangement here are illustrative.',
    focus: 4,
    stage: 3,
    claim: 'tuas-float-place',
    anchor: [-27, 9, 13],
    position: [-31, 14, 21],
  },
  {
    id: 14,
    name: 'Seabed',
    purpose:
      'The ground below the water is the starting point. Site preparation comes before the quay wall and the terminal above it.',
    focus: 2,
    stage: 0,
    claim: 'tuas-visual-mechanisms',
    anchor: [0, 0, 18],
    position: [8, 4, 24],
  },
];
export function visibleTuasLabels(
  value: TuasControls,
  year: number,
  stage: number,
  mode: string,
): TuasLabel[] {
  if (year < 2026) return [];
  const construction = mode === 'construction';
  const ids =
    !construction && value.section && [0, 1, 6, 7].includes(value.focus)
      ? [4, 5, 6]
      : construction
        ? [[14], [6], [7, 12], [8, 13], [4, 6], [4, 5], [5, 9, 10], [2, 4], [1, 2, 3, 11]][stage]
        : value.focus === 3
          ? [7, 12]
          : value.focus === 4
            ? [8, 13, 6]
            : value.focus === 5
              ? [4, 5, 9, 10]
              : value.focus === 2
                ? [4, 5, 6]
                : value.focus === 6
                  ? [1, 2, 3, 11]
                  : [1, 2, 3, 4];
  return tuasLabels
    .filter(
      (l) =>
        ids?.includes(l.id) &&
        (l.id !== 10 || value.treatment) &&
        (!value.section || ![1, 2, 3, 11].includes(l.id)),
    )
    .map((l) => {
      const anchor = [...l.anchor] as Point,
        position = [...l.position] as Point;
      const t = value.progress / 100;
      const offset = (x: number, y: number, z: number) => {
        anchor[0] += x;
        position[0] += x;
        anchor[1] += y;
        position[1] += y;
        anchor[2] += z;
        position[2] += z;
      };
      if (!construction && l.id === 8)
        offset(Math.min(t * 2, 1) * 14, -Math.max(0, t * 2 - 1) * 2.5, -Math.min(t * 2, 1) * 11);
      if (!construction && l.id === 13) offset(Math.min(t * 2, 1) * 10, 0, 0);
      if (l.id === 12) offset(0, (t - 0.5) * 6, 0);
      if (!construction && l.id === 11) {
        const drive = Math.max(0, (t - 0.75) * 4);
        offset(-7 * drive, 0, -10 * drive);
      }
      if (mode === 'exploded') offset(0, l.stage * 2, 0);
      return { ...l, anchor, position };
    });
}
