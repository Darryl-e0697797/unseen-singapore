# UNSEEN Singapore — DTSS Blender assembly

Open `dtss-assembly-replay.blend` in Blender. Built with Blender 5.2.1 LTS; other versions are untested. No add-ons, external textures or script auto-run are required to view the saved model.

The file opens on the completed scene. Scrub frames 1–270, or return to frame 1 and play the timeline, to see the assembly. Frame rate is 15 fps; all 368 components are present by frame 240. Use the camera view for the presentation framing.

This is an original schematic educational model. Geometry combines explanatory components from different DTSS phases and contexts; dimensions, spacing and adjacent shafts are illustrative. It is not a survey, construction drawing or engineering simulation. Visibility keyframes replay modelling order, not a verified physical construction programme or original elapsed authoring time.

To regenerate the saved scene and 270 PNG frames, run the supplied Python wrapper with your installed Blender:

    blender --background --factory-startup --python assembly_replay.py

The wrapper executes the supplied source through geometry creation, before export-time joining. It then creates presentation keyframes and a camera. Outputs are written alongside the wrapper. `assembly-order.json` lists component names and reveal frames. The script can be inspected without executing it.

Human engineering direction and iteration: project author. Original Astra contribution is attributed by the author; the included workflow is a later reproducible replay. Blender authors geometry; the web app adds its interactive explanations.

Source and original code/geometry are supplied under the accompanying project MIT licence. No government map imagery or third-party model assets are included. Linked government documents remain their owners’ materials and are not relicensed here.

Engineering context:
- https://www.pub.gov.sg/Professionals/Requirements/Used-Water/DTSS
- https://www.pub.gov.sg/Professionals/Requirements/Used-Water/DTSS/ConveyanceSystem

Project: https://github.com/Darryl-e0697797/unseen-singapore
Experience: https://unseen-singapore.darrylkai.chatgpt.site/
