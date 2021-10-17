export async function storyWriter(
  txt: string,
  elementId: string,
  delay: number
) {
  const letters = txt.split("");
  let i = 0;
  while (i < letters.length) {
    await waitForMs(delay);
    document.getElementById(elementId)!.innerHTML += letters[i];
    i++;
  }
  return;
}
function waitForMs(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
