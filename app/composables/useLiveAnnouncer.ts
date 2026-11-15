export function useLiveAnnouncer() {
  const { polite } = useAnnouncer();

  const announce = (message: string) => {
    polite("");
    nextTick(() => polite(message));
  };

  return { announce };
}
