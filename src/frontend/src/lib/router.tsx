import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface RouterContextValue {
  location: string;
  navigate: (to: string) => void;
  params: Record<string, string>;
}

const RouterContext = createContext<RouterContextValue>({
  location: "/",
  navigate: () => {},
  params: {},
});

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState(() => window.location.pathname);

  useEffect(() => {
    const handler = () => setLocation(window.location.pathname);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const navigate = useCallback((to: string) => {
    if (to !== window.location.pathname) {
      window.history.pushState(null, "", to);
      setLocation(to);
      window.scrollTo(0, 0);
    }
  }, []);

  const value = useMemo(
    () => ({ location, navigate, params: {} }),
    [location, navigate],
  );

  return (
    <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouterContext);
}

export function useLocation(): [string, (to: string) => void] {
  const { location, navigate } = useContext(RouterContext);
  return [location, navigate];
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

export function Link({
  href,
  children,
  onClick,
  className,
  ...props
}: LinkProps) {
  const { navigate } = useContext(RouterContext);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey) return;
    e.preventDefault();
    navigate(href);
    onClick?.(e);
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}

interface RouteProps {
  path: string;
  children: React.ReactNode;
}

export function Route({ path, children }: RouteProps) {
  const { location } = useContext(RouterContext);
  const match = matchPath(path, location);
  if (!match) return null;
  return <>{children}</>;
}

interface SwitchProps {
  children: React.ReactNode;
}

export function Switch({ children }: SwitchProps) {
  const { location } = useContext(RouterContext);
  const childArray = Array.isArray(children) ? children : [children];

  for (const child of childArray) {
    if (!child || typeof child !== "object" || !("props" in child)) continue;
    const props = (child as React.ReactElement<RouteProps>).props;
    if (!props.path) {
      // Fallback route (no path = 404)
      return <>{child}</>;
    }
    if (matchPath(props.path, location)) {
      return <>{child}</>;
    }
  }

  return null;
}

function matchPath(pattern: string, location: string): boolean {
  if (pattern === "*") return true;
  if (pattern === location) return true;

  // Convert pattern to regex
  const regexStr = `^${pattern.replace(/:[^/]+/g, "([^/]+)").replace(/\*/g, ".*")}$`;
  const regex = new RegExp(regexStr);
  return regex.test(location);
}
