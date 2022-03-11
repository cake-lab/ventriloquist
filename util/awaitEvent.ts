export const getPromiseFromEvent = (
  element: HTMLElement,
  event: string
): Promise<undefined> => {
  return new Promise<undefined>((resolve) => {
    const listener = () => {
      element.removeEventListener(event, listener);
      resolve(undefined);
    };
    element.addEventListener(event, listener);
  });
};
