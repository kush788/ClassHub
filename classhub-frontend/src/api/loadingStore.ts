type LoadingListener = (isLoading: boolean) => void;

let activeRequests = 0;
const listeners = new Set<LoadingListener>();

const notify = () => {
  listeners.forEach((listener) => listener(activeRequests > 0));
};

export const loadingStore = {
  start() {
    activeRequests++;
    notify();
  },

  stop() {
    activeRequests = Math.max(0, activeRequests - 1);
    notify();
  },

  subscribe(listener: LoadingListener) {
  listeners.add(listener);
  listener(activeRequests > 0);

  return () => {
    listeners.delete(listener);
  };
},
};