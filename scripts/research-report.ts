import { writeFileSync } from 'node:fs';
import { eras, notebooks, projects, researchSources } from '../packages/world';
const source = (id: string) => {
  const s = researchSources.find((s) => s.source_id === id)!;
  return `[${s.organisation}: ${s.title}](${s.url})`;
};
const links = (ids: string[]) => ids.map(source).join(' · ');
const out = [
  `# UNSEEN Singapore — Engineering atlas\n\nResearch cutoff: 14 September 2026. Nine public engineering themes, 45 sourced story chapters, 45 engineering notebook entries, 45 dated snapshots. Prepared for the interactive explorer at /explore.\n\n## Executive synthesis\n\nSingapore’s engineering story is a set of connected decisions: move water toward reclamation; fit rail into an occupied city; create ground that can support an automated port; reuse water through qualified treatment barriers; coordinate reservoir drainage with the tide; trade sand demand against the operating responsibilities of a polder; consider coastal protection alongside inland drainage; and use underground space to conserve land and support renewal. The exhibits begin with what each system does, then unpack how construction and planning make that outcome possible.\n\nThe 2050 view is a horizon for distinct targets and scenarios. Master Plan 2025 guides development over roughly 10–15 years; it is not a single “2050 masterplan” promising completion of every project. ${links(['ura-masterplan', 'ura-longterm'])}\n\n## Method and evidence boundaries\n\nPrimary agency and infrastructure-owner material, an archived project briefing, and public engineering publications were prioritised. NLB provides historical synthesis. Each chapter retains its source IDs; notebook entries separate documented context from our explanatory planning questions. No agency images, CAD, exact buried alignments or restricted operating data were imported. Natural Earth is public domain and used only for coarse orientation. Every engineering model is original schematic geometry.\n\nThis is a substantial first research atlas, not a complete archive of Singapore engineering, a contract reconstruction, or an independently peer-reviewed design assessment. Specific omissions include historical GIS coastlines, full station-by-station histories, approved construction programmes, detailed technical drawings, cost models, environmental assessment datasets and verified operating simulations.\n\n## Temporal coverage\n`,
];
for (const e of eras)
  out.push(`### ${e.label} — ${e.title}\n\n${e.body}\n\n${links(e.source_ids)}\n`);
out.push(
  '## All projects across time\n\n| Project | 1950s | 1965 | 2000 | 2026 | 2050 |\n|---|---|---|---|---|---|',
);
for (const p of projects)
  out.push(`| ${p.title} | ${p.snapshots.map((s) => s.status).join(' | ')} |`);
for (const p of projects) {
  out.push(
    `\n## ${p.title}\n\n**Now:** ${p.current_status}.\n\n**Reference measure:** ${p.metric.value} — ${p.metric.label}.\n\n${p.summary}\n\n${links(p.source_ids)}\n`,
  );
  for (const [i, c] of p.chapters.entries())
    out.push(
      `### ${i + 1}. ${c.title}\n\n*${c.kind === 'documented' ? 'Documented public-source synthesis' : 'Interpretation grounded in the cited context'}*\n\n${c.body}\n\n${links(c.source_ids)}\n`,
    );
  out.push(
    '### Engineering notebook\n\nThe following are explanatory engineering and planning questions, not disclosed contract requirements. Sources are those cited above.\n',
  );
  for (const n of notebooks[p.project_id]) out.push(`**${n.title}**\n\n${n.body}\n`);
  out.push(
    '### Representative construction sequence\n\nIllustrative order; no actual durations or contractor package schedule are implied.\n',
  );
  for (const [i, s] of p.stages.entries()) out.push(`${i + 1}. **${s.title}.** ${s.body}`);
  out.push('\n### Dated milestones\n');
  for (const e of p.events)
    out.push(`- **${e.year}${e.target ? ' — target' : ''}:** ${e.title}. ${source(e.source_id)}`);
  out.push('\n### Era snapshots\n');
  for (const s of p.snapshots)
    out.push(
      `- **${s.year === 1958 ? '1950s / 1958' : s.year} — ${s.status}:** ${s.summary} ${links(s.source_ids)}`,
    );
  out.push(`\n**Geometry boundary:** ${p.location_note}\n`);
}
out.push(
  `## Verification ledger and discrepancies\n\n- **MRT opening:** use the MOT history’s November 1987 public opening. A date in a secondary passage of the LTA TBM article conflicts; it is not used to set the first-service milestone.\n- **DTSS Phase 2:** a 2023 excavation milestone is not operational commissioning. The current PUB page supplies the from-2027 phased commissioning statement.\n- **Tuas:** current MPA pages mix refreshed page dates with older forward-looking prose. The atlas avoids claiming a verified 2026 berth count and separates opening, full-capacity target and net-zero ambition.\n- **Long Island:** URA’s 11 September 2026 update supersedes an account based only on the 2023 announcement. End-2026 preparatory works are still scheduled ahead at the research cutoff; the preparation area is not the final island profile.\n- **Transmission tunnels:** use SP’s later FY2024/25 report for completed-in-2019 status, rather than promoting the older prospective programme to an as-built date.\n- **Master Plan history:** the first-plan date is documented in the accessible Master Plan 2019 written statement. A prior MP2025 document path was unavailable; it was not treated as evidence.\n- **Historical geometry:** chronology is sourced, but no time-specific coastline dataset has been cleared and imported. Markers change status; the context polygon does not claim to transform historically.\n- **2050:** all nine entries are scenarios or an explicitly attributed official target. Long Island has no invented shared 2050 completion date.\n\n## Source register\n`,
);
for (const s of researchSources)
  out.push(
    `### ${s.source_id}\n\n${source(s.source_id)}\n\n- Reliability: ${s.reliability_level}\n- Accessed: ${s.access_date}\n- Publication / update: ${s.publication_date ?? 'not stated'} / ${s.update_date ?? 'not stated'}\n- Reuse: ${s.licence}\n- Intended use: ${s.intended_use}\n- Notes: ${s.notes}\n`,
  );
writeFileSync('docs/research/ENGINEERING-ATLAS.md', out.join('\n') + '\n');
console.log('Wrote research atlas with source-level bibliography.');
