import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";

/* Register plugins once at module level */
if (!gsap.core.globals().ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrollSmoother);
}

const prefersReduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Initialize all Rare Bird GSAP animations.
 * Call this inside a component's onMount; the returned function cleans up.
 * @param {HTMLElement} scope - The root element to scope selectors inside
 * @returns {Function} cleanup function to call on destroy
 */
export function initAnimations(scope) {
  let destroyed = false;
  let ctx = null;
  let splits = [];
  let cleanups = [];
  let smoother = null;
  let mm = null;
  let motionOn = null;
  let tickerOk = null;
  let pendingMotion = null;
  let tickerTimeout = null;
  let safetyTimeout = null;

  function addCleanup(fn) {
    cleanups.push(fn);
  }

  function clearAllTimeouts() {
    if (tickerTimeout) { clearTimeout(tickerTimeout); tickerTimeout = null; }
    if (safetyTimeout) { clearTimeout(safetyTimeout); safetyTimeout = null; }
  }

  /* Header scroll listener — independent of motion toggle */
  const header = scope.querySelector(".site-header");
  const onScroll = () => {
    if (header && !destroyed) header.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  addCleanup(() => window.removeEventListener("scroll", onScroll));
  onScroll();

  function build() {
    if (destroyed) return;
    document.body.classList.remove("no-motion");
    document.body.classList.add("motion-on");

    ctx = gsap.context(() => {
      /* ================= smooth scroll ================= */
      const wrapper = document.getElementById("smooth-wrapper");
      const content = document.getElementById("smooth-content");
      if (wrapper && content) {
        smoother = ScrollSmoother.create({
          wrapper: "#smooth-wrapper",
          content: "#smooth-content",
          smooth: 1.1,
          effects: true,
        });
      }

      /* anchor links route through the smoother */
      scope.querySelectorAll('a[href^="#"]').forEach((a) => {
        const fn = (e) => {
          const id = a.getAttribute("href");
          if (id.length > 1 && document.querySelector(id)) {
            e.preventDefault();
            if (smoother) {
              smoother.scrollTo(id, true, "top 96px");
            } else {
              const el = document.querySelector(id);
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }
          }
        };
        a.addEventListener("click", fn);
        addCleanup(() => a.removeEventListener("click", fn));
      });

      /* ================= intro: curtain + hero ================= */
      const loaderWord = scope.querySelector(".loader-word");
      const heroH1 = scope.querySelector(".hero h1");
      const loaderSplit = loaderWord ? new SplitText(loaderWord, { type: "chars" }) : null;
      const heroSplit = heroH1
        ? new SplitText(heroH1, {
            type: "lines,chars",
            mask: "lines",
            linesClass: "h-line",
          })
        : null;
      if (loaderSplit) splits.push(loaderSplit);
      if (heroSplit) splits.push(heroSplit);

      const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
      if (loaderSplit) {
        intro.from(loaderSplit.chars, { yPercent: 110, duration: 0.7, stagger: 0.035 }, 0.1);
      }
      intro
        .from(".loader-dots span", { scale: 0, duration: 0.5, stagger: 0.09, ease: "back.out(2.5)" }, "-=0.35")
        .to(".loader", { yPercent: -100, duration: 0.85, ease: "power4.inOut" }, "+=0.35")
        .to(".lp-a", { yPercent: -100, duration: 0.85, ease: "power4.inOut" }, "<0.09")
        .to(".lp-b", { yPercent: -100, duration: 0.85, ease: "power4.inOut" }, "<0.09")
        .set([".loader", ".lp-a", ".lp-b"], { display: "none" });

      if (heroSplit) {
        intro.from(
          heroSplit.chars,
          { yPercent: 120, rotation: 5, transformOrigin: "0% 100%", duration: 0.9, stagger: { each: 0.015 } },
          "-=0.7"
        );
      }
      intro
        .from(".hero .eyebrow", { clipPath: "inset(0% 100% 0% 0%)", duration: 0.8 }, "-=0.8")
        .from([".hero-sub", ".hero-ctas"], { y: 30, autoAlpha: 0, duration: 0.8, stagger: 0.12 }, "-=0.6")
        .from(
          ".hero .arch-clip",
          { clipPath: "inset(100% 0% 0% 0% round 999px 999px 28px 28px)", duration: 1.1, ease: "power3.inOut" },
          "-=1.0"
        );

      const heroArchImg = scope.querySelector(".hero .arch-clip .image-slot");
      if (heroArchImg) {
        intro.from(heroArchImg, { scale: 1.35, duration: 1.5, ease: "power3.out" }, "<");
      }
      intro
        .from(".hero .shape", { scale: 0, autoAlpha: 0, duration: 0.8, stagger: 0.09, ease: "back.out(1.8)" }, "-=1.0")
        .from(".scroll-cue", { autoAlpha: 0, duration: 0.6 }, "-=0.3");

      if (header) {
        intro.from(".site-header", { yPercent: -120, duration: 0.8 }, "-=0.9");
      }

      /* scroll cue fades as soon as you move */
      gsap.to(".scroll-cue", {
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { start: 60, end: 240, scrub: true },
      });

      /* header hides scrolling down, returns scrolling up */
      if (header) {
        ScrollTrigger.create({
          start: 300,
          end: "max",
          onUpdate(self) {
            gsap.to(".site-header", {
              yPercent: self.direction === 1 ? -120 : 0,
              duration: 0.4,
              ease: "power2.out",
              overwrite: "auto",
            });
          },
        });
      }

      /* ================= velocity-reactive marquee ================= */
      const mTrack = scope.querySelector(".marquee-track");
      if (mTrack) {
        const mTween = gsap.to(".marquee-track", { xPercent: -50, repeat: -1, ease: "none", duration: 22 });
        const skewTo = gsap.quickTo(".marquee-track", "skewX", { duration: 0.35, ease: "power2.out" });
        const speed = { v: 1 };
        const calm = gsap.delayedCall(0.3, () => {
          skewTo(0);
          gsap.to(speed, {
            v: speed.v < 0 ? -1 : 1,
            duration: 0.8,
            overwrite: true,
            onUpdate: () => mTween.timeScale(speed.v),
          });
        }).pause();
        ScrollTrigger.create({
          onUpdate(self) {
            const vel = self.getVelocity();
            const dir = vel < 0 ? -1 : 1;
            gsap.to(speed, {
              v: dir * gsap.utils.clamp(1, 6, 1 + Math.abs(vel) / 350),
              duration: 0.2,
              overwrite: true,
              onUpdate: () => mTween.timeScale(speed.v),
            });
            skewTo(gsap.utils.clamp(-8, 8, vel / 150));
            calm.restart(true);
          },
        });
      }

      /* ================= mission: word scrub + underline draw ================= */
      const missionStatement = scope.querySelector(".mission-statement");
      if (missionStatement) {
        const missionSplit = new SplitText(missionStatement, { type: "words", wordsClass: "word" });
        splits.push(missionSplit);
        gsap.from(missionSplit.words, {
          opacity: 0.12,
          y: 8,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: ".mission", start: "top 75%", end: "center 42%", scrub: 0.4 },
        });
      }
      const missionHl = scope.querySelector(".mission-statement .hl");
      if (missionHl) {
        gsap.fromTo(
          ".mission-statement .hl",
          { backgroundSize: "0% 0.12em" },
          {
            backgroundSize: "100% 0.12em",
            ease: "none",
            scrollTrigger: { trigger: ".mission", start: "center 62%", end: "center 34%", scrub: 0.4 },
          }
        );
      }

      /* ================= section headings: masked word reveal ================= */
      gsap.utils.toArray(scope.querySelectorAll("[data-split]")).forEach((el) => {
        const s = new SplitText(el, { type: "lines,words", mask: "lines" });
        splits.push(s);
        gsap.from(s.words, {
          yPercent: 120,
          rotation: 4,
          transformOrigin: "0% 100%",
          duration: 0.9,
          stagger: 0.03,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });

      /* ================= generic reveals ================= */
      gsap.utils.toArray(scope.querySelectorAll("[data-reveal-group]")).forEach((group) => {
        gsap.from(group.querySelectorAll("[data-reveal]"), {
          y: 42,
          autoAlpha: 0,
          duration: 0.95,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: { trigger: group, start: "top 80%", once: true },
        });
      });
      gsap.utils.toArray(scope.querySelectorAll("[data-reveal]:not([data-reveal-group] [data-reveal])")).forEach((el) => {
        gsap.from(el, {
          y: 42,
          autoAlpha: 0,
          duration: 0.95,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 84%", once: true },
        });
      });

      /* ================= pinned horizontal steps (desktop) ================= */
      mm = gsap.matchMedia();
      mm.add("(min-width: 981px)", () => {
        document.body.classList.add("steps-h");
        const track = scope.querySelector(".steps");
        const maskEl = scope.querySelector(".steps-mask");
        if (!track || !maskEl) return;
        const dist = () => Math.max(0, track.scrollWidth - maskEl.clientWidth);
        const horiz = gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: ".program-pin",
            start: "top 10%",
            end: () => "+=" + (dist() + 240),
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        gsap.to(".steps-progress span", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".program-pin",
            start: "top 10%",
            end: () => "+=" + (dist() + 240),
            scrub: 0.6,
          },
        });
        /* numerals drift slightly against the track */
        gsap.utils.toArray(scope.querySelectorAll(".step-num")).forEach((n) => {
          gsap.from(n, {
            xPercent: 40,
            ease: "none",
            scrollTrigger: {
              trigger: n,
              containerAnimation: horiz,
              start: "left 95%",
              end: "left 35%",
              scrub: true,
            },
          });
        });
        return () => document.body.classList.remove("steps-h");
      });

      /* ================= schools: clip-path expansion ================= */
      const schoolsSection = scope.querySelector(".schools");
      if (schoolsSection) {
        gsap.fromTo(
          ".schools",
          { clipPath: "inset(5% 4% 5% 4% round 48px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "none",
            scrollTrigger: { trigger: ".schools", start: "top 92%", end: "top 35%", scrub: 0.5 },
          }
        );
      }

      /* ================= story collage reveals ================= */
      const storyCollage = scope.querySelector(".story-collage");
      if (storyCollage) {
        gsap.from(".collage-arch .arch-clip", {
          clipPath: "inset(100% 0% 0% 0% round 999px 999px 28px 28px)",
          duration: 1.1,
          ease: "power3.inOut",
          scrollTrigger: { trigger: ".story-collage", start: "top 80%", once: true },
        });
        gsap.from(".collage-arch .image-slot", {
          scale: 1.3,
          duration: 1.6,
          ease: "power3.out",
          scrollTrigger: { trigger: ".story-collage", start: "top 80%", once: true },
        });
        gsap.from(".collage-circle", {
          scale: 0,
          duration: 0.9,
          ease: "back.out(1.6)",
          scrollTrigger: { trigger: ".story-collage", start: "top 70%", once: true },
        });
        gsap.from(".collage-shape", {
          scale: 0,
          duration: 0.9,
          ease: "back.out(1.6)",
          scrollTrigger: { trigger: ".story-collage", start: "top 75%", once: true },
        });
      }

      /* ================= footer wordmark ================= */
      const footerWord = scope.querySelector(".footer-word");
      if (footerWord) {
        const footSplit = new SplitText(footerWord, { type: "chars" });
        splits.push(footSplit);
        gsap.from(footSplit.chars, {
          yPercent: 70,
          autoAlpha: 0,
          rotation: 4,
          duration: 0.9,
          stagger: 0.04,
          ease: "back.out(1.4)",
          scrollTrigger: { trigger: ".site-footer", start: "top 85%", once: true },
        });
      }

      /* ================= magnetic buttons ================= */
      if (window.matchMedia("(pointer: fine)").matches) {
        scope.querySelectorAll(".btn").forEach((btn) => {
          const xTo = gsap.quickTo(btn, "x", { duration: 0.35, ease: "power3" });
          const yTo = gsap.quickTo(btn, "y", { duration: 0.35, ease: "power3" });
          const move = (e) => {
            const r = btn.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.45);
          };
          const leave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.45)", overwrite: "auto" });
          btn.addEventListener("mousemove", move);
          btn.addEventListener("mouseleave", leave);
          addCleanup(() => {
            btn.removeEventListener("mousemove", move);
            btn.removeEventListener("mouseleave", leave);
          });
        });
      }
    }, scope);

    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    clearAllTimeouts();
    cleanups.forEach((fn) => fn());
    cleanups = [];
    if (mm) {
      mm.revert();
      mm = null;
    }
    if (smoother) {
      smoother.kill();
      smoother = null;
    }
    if (ctx) {
      ctx.revert();
      ctx = null;
    }
    splits.forEach((s) => s.revert());
    splits = [];
    document.body.classList.remove("motion-on", "steps-h");
    document.body.classList.add("no-motion");
  }

  function setMotion(on) {
    if (destroyed) return;
    if (tickerOk === null) {
      pendingMotion = on;
      return;
    }
    if (prefersReduced() || !tickerOk) on = false;
    if (on === motionOn) return;
    motionOn = on;
    if (on) build();
    else destroy();
  }

  /* Ticker safety check */
  function start() {
    if (destroyed) return;
    const f0 = gsap.ticker.frame;
    tickerTimeout = setTimeout(() => {
      if (destroyed) return;
      tickerOk = gsap.ticker.frame > f0;
      setMotion(pendingMotion !== null ? pendingMotion : true);
    }, 120);
  }

  /* Initialize after fonts ready */
  let loadHandler = null;
  let domHandler = null;

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      if (destroyed) return;
      if (document.readyState === "loading") {
        domHandler = () => { if (!destroyed) start(); };
        document.addEventListener("DOMContentLoaded", domHandler);
      } else {
        start();
      }
    });
  } else {
    loadHandler = () => { if (!destroyed) start(); };
    window.addEventListener("load", loadHandler);
  }

  const refreshHandler = () => {
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  };
  window.addEventListener("load", refreshHandler);

  addCleanup(() => {
    if (domHandler) document.removeEventListener("DOMContentLoaded", domHandler);
    if (loadHandler) window.removeEventListener("load", loadHandler);
    window.removeEventListener("load", refreshHandler);
  });

  /* Safety timeout: if motion never initializes, show static page */
  safetyTimeout = setTimeout(() => {
    if (destroyed) return;
    if (document.body && !document.body.classList.contains("motion-on")) {
      document.body.classList.add("no-motion");
    }
  }, 2600);

  /* Motion toggle API */
  const motionApi = {
    enable: () => setMotion(true),
    disable: () => setMotion(false),
    toggle: () => setMotion(!motionOn),
    isOn: () => motionOn,
  };

  /* Expose for debugging / manual control */
  const motionFn = (on) => setMotion(on);
  if (typeof window !== "undefined") {
    window.rareBirdMotion = motionFn;
  }

  return () => {
    if (typeof window !== "undefined" && window.rareBirdMotion === motionFn) {
      window.rareBirdMotion = undefined;
    }
    destroy();
  };
}
