import { useEffect, useState } from "react";

export function useHashRoute() {
  const normalizeRoute = (value) => {
    const route = value || "/";
    return route.startsWith("/") ? route : `/${route}`;
  };

  const getRoute = () => {
    const hashRoute = window.location.hash.replace(/^#/, "");
    if (hashRoute) return normalizeRoute(hashRoute);

    return normalizeRoute(window.location.pathname.replace(/\/$/, "") || "/");
  };

  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const handleRouteChange = () => {
      setRoute(getRoute());
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("hashchange", handleRouteChange);
    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("hashchange", handleRouteChange);
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  return route;
}

export function useRevealAnimation(route) {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [route]);
}
