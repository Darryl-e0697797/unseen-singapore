# UNSEEN Singapore showcase — review draft

- Master: UNSEEN-Singapore-showcase.mp4 — 1920×1080, 30 fps, H.264/yuv420p, 82 seconds, silent with burned-in captions.
- Separate captions: UNSEEN-Singapore-captions.srt.
- Thumbnail: UNSEEN-Singapore-thumbnail.jpg.
- LinkedIn-draft.md is unposted copy for review.
- edit-manifest.json records scene order, captions, durations and frame counts.

## Provenance

Recorded real interactions with the local production build matching public Sites version 4, source 079b7d0b91103f897d44d17eb55882e4ba67f1bd. The live app is https://unseen-singapore.darrylkai.chatgpt.site . No engineering geometry or app code was changed for capture. Actions use agent-browser, attached to an isolated Chrome profile through CDP port 9223.

The CLI's 10 fps recorder was rejected after a probe. scripts/qa/showcase-recorder.mjs captures actual JPEG frames and timestamps through Page.startScreencast; it does not control the app. One animated test captured 388 frames over 7.37 seconds. Output is resampled to 30 fps from original timestamps; static frames are held, with no generated motion or optical-flow interpolation. Opening/ending cards and captions are editorial additions. No voice or licensed music is included.

## Captured interactions

1. Overview: Marina Bay, Whole island, 3D context.
2. DTSS: native island network, enter engineering story, boring machine, rings/protection drawing key.
3. Tuas: Float. Place. Retain.; reset and play the caisson placement mechanism.
4. MRT: Bore and line; play the tunnel mechanism. The unused station-method tail was trimmed.
5. Barrage: Rain at low tide → Rain at high tide; play mechanism and use ordinary viewport zoom to improve framing.
6. Tekong: Inside the dike → Two different pumping jobs; play the circulation mechanism. The attempted operating-level button click was obstructed and did not change the scene; captions do not claim a discharge demonstration.

The edit uses schematic/illustrative classifications consistent with the app. Source attribution remains in map footage; title cards carry explicit map attribution. Final public posting is not authorised by creation of this draft.

## Reproduce the edit

With original frames retained under raw/ and the overview screenshot under frames/, run scripts/qa/render-showcase.py with Python/Pillow and ffmpeg available. System fonts used: Arial and Georgia. The script reconstructs original timing, adds captions and fades, encodes each scene and joins the master. Rendering does not require new engineering assets or alter the app.

## Verification

The final app source passed 36 unit tests, 34 GitHub browser tests and 26 public-site browser regressions before capture. No app code changes were made for this recording. Full MP4 decode and metadata validation are recorded locally; sampled frame sequences were inspected for camera movement, model state and caption placement. Raw capture files and intermediates are excluded from Git to avoid uploading over a gigabyte of duplicate footage.

## Original music version

UNSEEN-Singapore-showcase-with-music.mp4 adds an original 88 BPM ambient electronic score, composed and synthesised by scripts/qa/compose-showcase-music.py. No external recordings, samples or existing songs are used. Warm sustained chords, plucked notes, bass and quiet percussion fade in over three seconds and out over five. The score is normalised to approximately -23 LUFS for background use. Video is copied unchanged, with stereo 48 kHz AAC audio. The silent master remains available.

## Narrated revision

UNSEEN-Singapore-narrated-showcase.mp4 is the 88-second narrated revision. It preserves direct transitions between marvels and adds one actual return to Singapore's map after Tekong, before the closing card. The synthetic narrator is the installed macOS Daniel voice; it is not the user's voice or a claimed Astra voice. Each narration clip is placed in a bounded story slot without time-compressing speech. Voiceover-script.md and UNSEEN-Singapore-voiceover.srt contain the transcript.

The original instrumental is stretched from 82 to 88 seconds with pitch preserved, lowered, and ducked under speech. Captions replace the chapter footer during narration, with title cards retaining their own text. The previous silent and music-only videos remain available. Narration generation and final mixing are reproducible with scripts/qa/narrate-showcase.py and scripts/qa/mix-showcase-narration.py.

## Reveal-first 60-second revision

`UNSEEN-Singapore-reveal-first-60s.mp4` follows the requested LinkedIn structure: Singapore → underground reveal (0–4), title (4–7), infrastructure (7–20), storytelling (20–30), Astra and actual build evidence (30–38), finished product (38–50), challenge (50–55), public site (55–60). Previous masters remain unchanged.

The opening wipe is an editorial transition between actual app recordings, not a new native reveal feature. Hero crops enlarge actual model footage; no generated footage or geometry was substituted. Chapter captions are burned in; the narration transcript is available separately in `UNSEEN-reveal-first-voiceover.srt`. The synthetic macOS Daniel voice accompanies the original instrumental, retimed with pitch preserved and ducked under speech.

The build segment is a custom local build-journal viewer displaying real source code and live Blender output, not a recording of the Codex conversation. Astra ran the unchanged DTSS authoring pipeline in a temporary copy. The process exited 0 and exported a valid 1,621,204-byte GLB with 31,576 triangles and five construction stages. Existing app assets were not overwritten. Blender emitted non-fatal authoring/deprecation warnings, preserved in the evidence. `teaser/build-evidence.json` records the process evidence. The text/log viewer was recorded at 10 fps and encoded into the 30 fps edit; the 3D app footage retains timestamp-based CDP capture.

Reproduction scripts: `scripts/qa/showcase-build-proof.mjs`, `render-teaser.py`, `narrate-teaser.py`, and `mix-teaser.py`. Intermediate assets and source frame captures are local only. Verified full decode without errors, 60-second duration, 1920×1080 H.264 at 30 fps, stereo AAC; manually inspected individual frames across all chapters, including the running and completed build. This is a review export, not a public post.

## Second-post preview

The user reserved the reveal-first 60-second film for post three, the full review. `UNSEEN-Singapore-post-2-teaser-7s.mp4` is a seven-second surface-only excerpt from the actual `overview-final` capture (0.5–7.5 seconds), with the existing original background score and short audio fades. It preserves the app interface and map attribution, with no engineering reveal or narration. `UNSEEN-Singapore-post-2-still.jpg` is an unmodified extracted video frame. Both are 1920×1080; the video is 30 fps H.264/AAC, verified by complete decode and metadata. The supplied shared ChatGPT posting-plan link could not be loaded during preparation; no claim is made to have reviewed that conversation. Nothing was posted.
