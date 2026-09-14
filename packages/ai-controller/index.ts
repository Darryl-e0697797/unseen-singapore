import { stories } from '../data';
import { levelSchema, type Level, type SceneCommand } from '../shared/schema';
export type Answer = {
  intent: string;
  title: string;
  narrative: string;
  source_ids: string[];
  commands: SceneCommand[];
};
export function askSingapore(question: string, level: Level = 'public'): Answer {
  levelSchema.parse(level);
  if (question.length > 500) return unavailable('Please keep your question under 500 characters.');
  const q = question.toLowerCase().trim();
  if (!q) return unavailable('Ask about used water, tunnel depth or underground rail.');
  if (/\b(reset|start over)\b/.test(q))
    return {
      intent: 'reset',
      title: 'Back at the surface.',
      narrative: 'Reveal the section to explore the systems beneath this representative city.',
      source_ids: [],
      commands: [{ type: 'resetScene' }],
    };
  if (/\b(tuas|port|caisson|1930|1965|2000|2050|histor|coast|future|district)\b/.test(q))
    return unavailable(
      'This first chapter covers a representative DTSS journey and rail context. Tuas construction, historical coastlines, district data and future scenarios need additional sourced content before they can be shown.',
    );
  if (/\b(exact|coordinates?|alignment|capacity|flow rate|simulate|simulation|pressure)\b/.test(q))
    return unavailable(
      'This model has no authoritative alignment, survey levels or calibrated simulation. It can explain relationships, but cannot provide exact locations or engineering calculations.',
    );
  const sid = /\b(mrt|rail|train|station)\b/.test(q)
    ? 'rail-context'
    : /\b(deep|depth|why.*underground|gradient)\b/.test(q)
      ? 'why-depth'
      : /\b(flow|travel|drop|follow|journey|how.*water)\b/.test(q)
        ? 'follow-water'
        : /\b(dtss|used water|reveal|hidden infrastructure)\b/.test(q) ||
            /^(why was (this|it) built\??|show me singapore['’]s hidden infrastructure\.?)$/.test(q)
          ? 'why-dtss'
          : null;
  const story = stories.find((s) => s.story_id === sid);
  if (!story)
    return unavailable(
      'I don’t have reviewed content for that question yet. Try “Why was DTSS built?”, “Follow one drop”, or “Show rail context”.',
    );
  return {
    intent: story.story_id,
    title: story.title,
    narrative: story.narratives[level],
    source_ids: story.source_ids,
    commands: story.commands,
  };
}
function unavailable(narrative: string): Answer {
  return {
    intent: 'unavailable',
    title: 'Beyond this chapter, for now.',
    narrative,
    source_ids: [],
    commands: [],
  };
}
