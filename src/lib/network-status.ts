let poorNetworkConnection = false;
const listeners = new Set<(value: boolean) => void>();

export function setPoorNetworkConnection(value: boolean) {
  if (poorNetworkConnection === value) return;
  poorNetworkConnection = value;
  listeners.forEach((listener) => listener(value));
}

export function getPoorNetworkConnection() {
  return poorNetworkConnection;
}

export function subscribePoorNetworkConnection(
  listener: (value: boolean) => void,
) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
