# Scene system

Scene state is serializable and renderer-independent: reveal, layer visibility, camera preset, selected asset, tracing, annotation, source IDs and era. Pure reducer accepts only a fully validated command batch. Entire batch is rejected if any command or reference is invalid; never apply a partially valid model response. Upper bound: 16 commands per answer.

Implemented first-slice vocabulary: resetScene, focusAsset, setLayerVisibility, setCamera, showSection, traceSystem, showAnnotation, showSource, setEra. Camera and annotation targets are curated IDs. setEra only accepts loaded present-era content; historical and future requests explain missing evidence without changing the scene.

Reserved extensions (not accepted until implemented): focusRegion, playSequence, compareStates. Adding an operation requires schema, reducer, renderer behavior, tests and documentation. Unsupported commands fail closed.

Reveal changes surface opacity, exposes underground geometry and moves camera to a section preset. Surface context remains legible. Tunnel and MRT layers are independently visible. Tracing is representative directional animation, never a hydraulic result; it follows a known scene path only. Layer off stops its trace. Reset restores canonical state and camera, including after manual orbit.

Renderer uses continuous interpolation only during camera transitions/flow. User orbit cancels camera interpolation; new commands restore a deterministic preset. Repeated question replaces previous explanation and state rather than leaving conflicting modes. Selected content is available through accessible HTML controls as well as mesh picking. Labels are DOM content outside the scene for readable, keyboard-accessible explanations.

An island orientation inset establishes Singapore context; the detailed model is a conceptual section, not a geolocated map. Vertical exaggeration or diagrammatic distance is always labelled.
