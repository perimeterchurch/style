"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AnimatedList: () => AnimatedList,
  AnimatedPanel: () => AnimatedPanel,
  CountUp: () => CountUp,
  FadeIn: () => FadeIn,
  ScaleIn: () => ScaleIn,
  SkeletonTransition: () => SkeletonTransition,
  SlideUp: () => SlideUp,
  durations: () => durations,
  easings: () => easings,
  fadeVariants: () => fadeVariants,
  modalBackdropVariants: () => modalBackdropVariants,
  modalPanelVariants: () => modalPanelVariants,
  pageSlideVariants: () => pageSlideVariants,
  scaleInVariants: () => scaleInVariants,
  slideDownVariants: () => slideDownVariants,
  slideLeftVariants: () => slideLeftVariants,
  slideRightVariants: () => slideRightVariants,
  slideUpVariants: () => slideUpVariants,
  springs: () => springs,
  staggerContainer: () => staggerContainer,
  staggerItemVariants: () => staggerItemVariants,
  staggers: () => staggers,
  transitions: () => transitions
});
module.exports = __toCommonJS(index_exports);

// src/config.ts
var springs = {
  snappy: { type: "spring", stiffness: 500, damping: 30 },
  gentle: { type: "spring", stiffness: 200, damping: 20 },
  bouncy: { type: "spring", stiffness: 300, damping: 15 }
};
var durations = {
  fast: 0.15,
  base: 0.2,
  slow: 0.3,
  entrance: 0.4
};
var easings = {
  easeOut: [0.16, 1, 0.3, 1],
  easeInOut: [0.4, 0, 0.2, 1]
};
var staggers = {
  fast: 0.03,
  base: 0.05,
  slow: 0.08
};
var transitions = {
  /** Quick tween for micro-interactions */
  fast: {
    duration: durations.fast,
    ease: easings.easeOut
  },
  /** Default tween for most animations */
  base: {
    duration: durations.base,
    ease: easings.easeOut
  },
  /** Slower tween for emphasis */
  slow: {
    duration: durations.slow,
    ease: easings.easeOut
  },
  /** Entrance animation with gentle easing */
  entrance: {
    duration: durations.entrance,
    ease: easings.easeOut
  },
  /** Snappy spring for interactive feedback */
  snappy: springs.snappy,
  /** Gentle spring for layout shifts */
  gentle: springs.gentle,
  /** Bouncy spring for playful elements */
  bouncy: springs.bouncy
};
var fadeVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.base
  },
  exit: {
    opacity: 0,
    transition: transitions.fast
  }
};
var slideUpVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.base
  },
  exit: {
    opacity: 0,
    y: 6,
    transition: transitions.fast
  }
};
var slideDownVariants = {
  hidden: { opacity: 0, y: -6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.base
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: transitions.fast
  }
};
var scaleInVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.base
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: transitions.fast
  }
};
var slideRightVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: transitions.snappy
  },
  exit: {
    x: "100%",
    transition: transitions.base
  }
};
var slideLeftVariants = {
  hidden: { x: "-100%" },
  visible: {
    x: 0,
    transition: transitions.snappy
  },
  exit: {
    x: "-100%",
    transition: transitions.base
  }
};
var pageSlideVariants = {
  enter: (dir) => ({
    x: dir * 80,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: durations.base,
      ease: easings.easeInOut
    }
  },
  exit: (dir) => ({
    x: dir * -80,
    opacity: 0,
    transition: {
      duration: durations.fast,
      ease: easings.easeInOut
    }
  })
};
var modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.base, ease: easings.easeOut }
  },
  exit: {
    opacity: 0,
    transition: { duration: durations.fast, ease: easings.easeOut }
  }
};
var modalPanelVariants = {
  hidden: { opacity: 0, scale: 0.97, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.base
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 8,
    transition: transitions.fast
  }
};
function staggerContainer(staggerDelay = staggers.base) {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay
      }
    },
    exit: {
      transition: {
        staggerChildren: staggerDelay,
        staggerDirection: -1
      }
    }
  };
}
var staggerItemVariants = {
  hidden: { opacity: 0, y: 4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.base
  },
  exit: {
    opacity: 0,
    y: 4,
    transition: transitions.fast
  }
};

// src/FadeIn/index.tsx
var import_framer_motion = require("framer-motion");
var import_jsx_runtime = require("react/jsx-runtime");
function FadeIn({ delay, transition, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_framer_motion.motion.div,
    {
      variants: fadeVariants,
      initial: "hidden",
      animate: "visible",
      exit: "exit",
      transition: delay ? { ...transition, delay } : transition,
      ...props
    }
  );
}

// src/SlideUp/index.tsx
var import_framer_motion2 = require("framer-motion");
var import_jsx_runtime2 = require("react/jsx-runtime");
function SlideUp({ delay, transition, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    import_framer_motion2.motion.div,
    {
      variants: slideUpVariants,
      initial: "hidden",
      animate: "visible",
      exit: "exit",
      transition: delay ? { ...transition, delay } : transition,
      ...props
    }
  );
}

// src/ScaleIn/index.tsx
var import_framer_motion3 = require("framer-motion");
var import_jsx_runtime3 = require("react/jsx-runtime");
function ScaleIn({ delay, transition, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    import_framer_motion3.motion.div,
    {
      variants: scaleInVariants,
      initial: "hidden",
      animate: "visible",
      exit: "exit",
      transition: delay ? { ...transition, delay } : transition,
      ...props
    }
  );
}

// src/AnimatedList/index.tsx
var import_framer_motion4 = require("framer-motion");
var import_react = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
function AnimatedList({
  children,
  staggerDelay = staggers.base,
  itemVariants = staggerItemVariants,
  as: Tag = "div",
  ...props
}) {
  const containerVariants = (0, import_react.useMemo)(
    () => ({
      hidden: {},
      visible: {
        transition: {
          staggerChildren: staggerDelay
        }
      },
      exit: {
        transition: {
          staggerChildren: staggerDelay,
          staggerDirection: -1
        }
      }
    }),
    [staggerDelay]
  );
  const Container = Tag === "ul" ? import_framer_motion4.motion.ul : Tag === "ol" ? import_framer_motion4.motion.ol : import_framer_motion4.motion.div;
  const Item = Tag === "ul" || Tag === "ol" ? import_framer_motion4.motion.li : import_framer_motion4.motion.div;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    Container,
    {
      variants: containerVariants,
      initial: "hidden",
      animate: "visible",
      exit: "exit",
      ...props,
      children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_framer_motion4.AnimatePresence, { children: import_react.Children.map(children, (child, index) => {
        if (!child) return null;
        return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          Item,
          {
            variants: itemVariants,
            transition: {
              ...transitions.base,
              delay: index * staggerDelay
            },
            children: child
          },
          child?.key ?? `item-${index}`
        );
      }) })
    }
  );
}

// src/AnimatedPanel/index.tsx
var import_framer_motion5 = require("framer-motion");
var import_react2 = require("react");
var import_jsx_runtime5 = require("react/jsx-runtime");
function AnimatedPanel({
  open,
  onClose,
  width = 380,
  backdrop = false,
  className,
  backdropClassName,
  children,
  style,
  ...props
}) {
  const handleKeyDown = (0, import_react2.useCallback)(
    (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );
  (0, import_react2.useEffect)(() => {
    if (!open) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_framer_motion5.AnimatePresence, { children: open && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
    backdrop && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      import_framer_motion5.motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: transitions.fast,
        className: backdropClassName || "fixed inset-0 z-[var(--z-modal-backdrop,1040)] bg-black/30",
        onClick: onClose
      },
      "panel-backdrop"
    ),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      import_framer_motion5.motion.div,
      {
        variants: slideRightVariants,
        initial: "hidden",
        animate: "visible",
        exit: "exit",
        className,
        style: {
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width,
          zIndex: "var(--z-modal, 1050)",
          ...style
        },
        ...props,
        children
      },
      "panel-content"
    )
  ] }) });
}

// src/CountUp/index.tsx
var import_framer_motion6 = require("framer-motion");
var import_react3 = require("react");
var import_jsx_runtime6 = require("react/jsx-runtime");
var defaultFormat = (v) => Math.round(v).toLocaleString();
function CountUp({
  value,
  springConfig = { stiffness: 200, damping: 20 },
  format = defaultFormat,
  className
}) {
  const ref = (0, import_react3.useRef)(null);
  const motionValue = (0, import_framer_motion6.useSpring)(0, springConfig);
  const display = (0, import_framer_motion6.useTransform)(motionValue, (latest) => format(latest));
  (0, import_react3.useEffect)(() => {
    motionValue.set(value);
  }, [value, motionValue]);
  (0, import_react3.useEffect)(() => {
    const unsubscribe = display.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = latest;
      }
    });
    return unsubscribe;
  }, [display]);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { ref, className });
}

// src/SkeletonTransition/index.tsx
var import_framer_motion7 = require("framer-motion");
var import_jsx_runtime7 = require("react/jsx-runtime");
function SkeletonTransition({ isLoading, skeleton, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_framer_motion7.AnimatePresence, { mode: "wait", children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    import_framer_motion7.motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: transitions.fast,
      children: skeleton
    },
    "skeleton"
  ) : /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    import_framer_motion7.motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: transitions.base,
      children
    },
    "content"
  ) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AnimatedList,
  AnimatedPanel,
  CountUp,
  FadeIn,
  ScaleIn,
  SkeletonTransition,
  SlideUp,
  durations,
  easings,
  fadeVariants,
  modalBackdropVariants,
  modalPanelVariants,
  pageSlideVariants,
  scaleInVariants,
  slideDownVariants,
  slideLeftVariants,
  slideRightVariants,
  slideUpVariants,
  springs,
  staggerContainer,
  staggerItemVariants,
  staggers,
  transitions
});
//# sourceMappingURL=index.cjs.map