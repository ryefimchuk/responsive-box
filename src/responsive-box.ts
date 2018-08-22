interface InnerListener {

  (event: UIEvent): void;
}

function throttle(listener: InnerListener, limit: number): InnerListener {

  if (!limit || limit < 0) {

    return listener;
  }

  let lastTimeoutId: number;
  let lastInvocationTimestamp: number;

  return function (this: Window, event: UIEvent): void {

    const context: Window = this;

    if (!lastInvocationTimestamp) {

      listener.call(context, event);
      lastInvocationTimestamp = Date.now();
    } else {

      clearTimeout(lastTimeoutId);

      lastTimeoutId = window.setTimeout((): void => {

        if ((Date.now() - lastInvocationTimestamp) >= limit) {

          listener.call(context, event);
          lastInvocationTimestamp = Date.now();
        }
      }, limit - (Date.now() - lastInvocationTimestamp));
    }
  };
}

export function watchResizing(element: HTMLElement, listener: (width: number, height: number, event?: UIEvent) => void, throttleLimit: number = 0): Function {

  let width: number;
  let height: number;

  const innerListener: InnerListener = throttle((event: UIEvent): void => {

    let shouldNotify = false;

    if (width !== element.offsetWidth) {

      width = element.offsetWidth;
      shouldNotify = true;
    }

    if (height !== element.offsetHeight) {

      height = element.offsetHeight;
      shouldNotify = true;
    }

    if (shouldNotify) {

      listener(width, height, event);
    }
  }, throttleLimit);

  window.addEventListener('resize', innerListener);

  return (): void => {

    window.removeEventListener('resize', innerListener);
  };
}