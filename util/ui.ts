export function createButton(
  text: string,
  top: string,
  right: string
): HTMLButtonElement {
  const button = document.createElement("button");
  button.innerText = text;
  button.style.position = "fixed";
  button.style.top = top;
  button.style.right = right;
  button.style.zIndex = "1000";
  document.body.appendChild(button);
  return button;
}
