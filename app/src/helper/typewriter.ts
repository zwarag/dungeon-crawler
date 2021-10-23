export async function storyWriter(
  txt: string,
  elementId: string,
  delay: number
): Promise<void> {
  const letters = [...txt];
  let i = 0;
  while (i < letters.length) {
    await waitForMs(delay);
    (document.querySelector(`#${elementId}`) as HTMLElement).innerHTML += letters[i];
    i++;
  }
}
function waitForMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
