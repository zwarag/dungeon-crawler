export async function storyWriter(
  txt: string,
  elementId: string,
  delay: number,
): Promise<void> {
  const letters = txt.split("");
  let i = 0;
  while (i < letters.length) {
    await waitForMs(delay);
    document.querySelector(`#${elementId}`)!.innerHTML += letters[i];
    i++;
  }
}
function waitForMs(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
