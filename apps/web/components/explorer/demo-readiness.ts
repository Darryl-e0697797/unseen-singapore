import { projects, type Project } from '@unseen/world';
import progress from '../../../../content/workflow/progress.json';

export function hasDetailedDemo(project: Project) {
  return progress.projects.some((p) => p.project_id === project.project_id && p.stage === 'accepted') &&
    (project.project_id === 'dtss' || Boolean(project.detailed_exhibit));
}
export const detailedDemoCount = projects.filter(hasDetailedDemo).length;
export const demoLabel = (project: Project) => hasDetailedDemo(project) ? 'Detailed' : 'Simplified';
