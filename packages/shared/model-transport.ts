/** Lossless byte shuffling improves compression of repeated XYZ float data.
 * USG1 + uint32 LE original length + one-byte stride, followed by byte planes.
 * Original GLBs remain the portable, authoritative model assets.
 */
export function packModel(input: Uint8Array): Uint8Array {
  const output = new Uint8Array(input.length + 9);
  output.set([85, 83, 71, 49]);
  new DataView(output.buffer).setUint32(4, input.length, true);
  output[8] = 12;
  let at = 9;
  for (let lane = 0; lane < 12; lane++)
    for (let i = lane; i < input.length; i += 12) output[at++] = input[i];
  return output;
}
export function unpackModel(input: Uint8Array): Uint8Array {
  if (input.length < 9 || input[0] !== 85 || input[1] !== 83 || input[2] !== 71 || input[3] !== 49)
    throw new Error('Invalid model transport header');
  const size = new DataView(input.buffer, input.byteOffset, input.byteLength).getUint32(4, true);
  const stride = input[8];
  if (stride !== 12 || size !== input.length - 9 || size > 64 * 1024 * 1024)
    throw new Error('Invalid model transport length');
  const output = new Uint8Array(size);
  let at = 9;
  for (let lane = 0; lane < stride; lane++)
    for (let i = lane; i < size; i += stride) output[i] = input[at++];
  return output;
}
