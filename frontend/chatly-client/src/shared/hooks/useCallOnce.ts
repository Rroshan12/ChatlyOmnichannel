import { useRef, useEffect } from 'react';

export default function useCallOnce(callback: () => void | Promise<void>) {
  const hasCalled = useRef(false);

  useEffect(() => {
    if (!hasCalled.current) {
      hasCalled.current = true;
      callback();
    }
  }, [callback]);
}
