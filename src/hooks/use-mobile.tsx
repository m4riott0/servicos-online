import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const checkIsMobile = React.useCallback(
    () => window.innerWidth < MOBILE_BREAKPOINT,
    []
  );

  const [isMobile, setIsMobile] = React.useState<boolean>(checkIsMobile);

  React.useEffect(() => {
    const onChange = () => setIsMobile(checkIsMobile());

    window.addEventListener("resize", onChange);
    onChange();

    return () => window.removeEventListener("resize", onChange);
  }, [checkIsMobile]);

  return isMobile;
}
