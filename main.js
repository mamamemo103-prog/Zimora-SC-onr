(() => {
  const root = document.documentElement;

  const top = document.querySelector(".zm-head");
  const toggle = document.querySelector(".zm-burger");
  const nav = document.querySelector("#zm-nav");

  const close = () => {
    if (!top || !toggle || !nav) return;
    top.classList.remove("zm-head--open");
    toggle.setAttribute("aria-expanded", "false");
  };

  const open = () => {
    if (!top || !toggle || !nav) return;
    top.classList.add("zm-head--open");
    toggle.setAttribute("aria-expanded", "true");
  };

  if (toggle && top && nav) {
    toggle.addEventListener("click", () => {
      const on = top.classList.toggle("zm-head--open");
      toggle.setAttribute("aria-expanded", on ? "true" : "false");
    });

    nav.addEventListener("click", (ev) => {
      const t = ev.target;
      if (t && t.tagName === "A") close();
    });

    window.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") close();
    });

    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width:880px)").matches) close();
    });
  }

  const filters = Array.from(document.querySelectorAll("[data-zm-filter]"));
  const tiles = Array.from(document.querySelectorAll("[data-zm-cat]"));

  const applyFilter = (key) => {
    if (!tiles.length) return;
    const k = String(key || "all").toLowerCase();
    tiles.forEach((el) => {
      const c = String(el.getAttribute("data-zm-cat") || "all").toLowerCase();
      const on = k === "all" || c === k;
      el.hidden = !on;
    });
    filters.forEach((btn) => {
      const fk = String(btn.getAttribute("data-zm-filter") || "all").toLowerCase();
      const on = fk === k;
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    if (top) top.dataset.filter = k;
  };

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      applyFilter(btn.getAttribute("data-zm-filter"));
    });
  });

  const initFilter = () => {
    if (!filters.length) return "all";
    const pressed =
      filters.find((b) => b.getAttribute("aria-pressed") === "true") || filters[0];
    return String(pressed.getAttribute("data-zm-filter") || "all").toLowerCase();
  };

  const hashKey = String(location.hash || "")
    .replace(/^#/, "")
    .toLowerCase();
  const hashToFilter = {
    wheel: "wheel",
    slotsfeel: "slots",
    roulette: "roulette",
    blackjack: "blackjack",
    poker: "poker",
    slots: "slots",
  };
  const fromHash = hashToFilter[hashKey];

  if (filters.length && tiles.length) {
    if (fromHash && filters.some((b) => b.getAttribute("data-zm-filter") === fromHash)) {
      applyFilter(fromHash);
    } else {
      applyFilter(initFilter());
    }
  } else if (filters.length) applyFilter(initFilter());

  const isDemoView = root.classList.contains("demo-gv");
  const gvBar = document.querySelector(".gv-toolbar");
  const gvCoins = document.querySelector("#gv-coins");
  const gvPlus = document.querySelector("#gv-plus");

  let gv = 0;
  let gvRaf = 0;

  const gvFmt = (n) => Math.max(0, Math.floor(Number(n) || 0)).toLocaleString("en-US");

  const gvPulse = () => {
    if (!gvBar) return;
    gvBar.classList.remove("is-pulse");
    void gvBar.offsetWidth;
    gvBar.classList.add("is-pulse");
  };

  const gvApply = (val) => {
    gv = Math.max(0, Math.floor(Number(val) || 0));
    if (gvCoins) gvCoins.textContent = gvFmt(gv);
  };

  const gvLoad = () => {
    try {
      const raw = sessionStorage.getItem("gvCoins");
      if (raw == null) {
        gvApply(8000);
        sessionStorage.setItem("gvCoins", String(gv));
        return;
      }
      gvApply(raw);
    } catch {
      gvApply(8000);
    }
  };

  const gvSave = () => {
    try {
      sessionStorage.setItem("gvCoins", String(gv));
    } catch {
      /* ignore */
    }
  };

  const gvOnPlus = () => {
    gvApply(gv + 500);
    gvSave();
    gvPulse();
  };

  if (isDemoView && gvBar && gvCoins) {
    gvLoad();
    if (gvPlus) gvPlus.addEventListener("click", gvOnPlus);

    window.addEventListener(
      "zimora:coins",
      (e) => {
        try {
          const next = e && e.detail && typeof e.detail.total === "number" ? e.detail.total : gv;
          gvApply(next);
          gvSave();
          if (gvRaf) cancelAnimationFrame(gvRaf);
          gvRaf = requestAnimationFrame(() => gvPulse());
        } catch {
          /* ignore */
        }
      },
      false
    );
  }

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) en.target.classList.add("zm-reveal--in");
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".zm-reveal").forEach((el) => obs.observe(el));

  const year = document.querySelectorAll(".js-year");
  if (year.length) {
    const y = new Date().getFullYear();
    year.forEach((el) => {
      el.textContent = String(y);
    });
  }
})();
