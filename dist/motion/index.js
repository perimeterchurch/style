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
import { motion } from "framer-motion";
import { jsx } from "react/jsx-runtime";
function FadeIn({ delay, transition, ...props }) {
  return /* @__PURE__ */ jsx(
    motion.div,
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
import { motion as motion2 } from "framer-motion";
import { jsx as jsx2 } from "react/jsx-runtime";
function SlideUp({ delay, transition, ...props }) {
  return /* @__PURE__ */ jsx2(
    motion2.div,
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
import { motion as motion3 } from "framer-motion";
import { jsx as jsx3 } from "react/jsx-runtime";
function ScaleIn({ delay, transition, ...props }) {
  return /* @__PURE__ */ jsx3(
    motion3.div,
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
import { AnimatePresence, motion as motion4 } from "framer-motion";
import { Children, useMemo } from "react";
import { jsx as jsx4 } from "react/jsx-runtime";
function AnimatedList({
  children,
  staggerDelay = staggers.base,
  itemVariants = staggerItemVariants,
  as: Tag = "div",
  ...props
}) {
  const containerVariants = useMemo(
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
  const Container = Tag === "ul" ? motion4.ul : Tag === "ol" ? motion4.ol : motion4.div;
  const Item = Tag === "ul" || Tag === "ol" ? motion4.li : motion4.div;
  return /* @__PURE__ */ jsx4(
    Container,
    {
      variants: containerVariants,
      initial: "hidden",
      animate: "visible",
      exit: "exit",
      ...props,
      children: /* @__PURE__ */ jsx4(AnimatePresence, { children: Children.map(children, (child, index) => {
        if (!child) return null;
        return /* @__PURE__ */ jsx4(
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
import { AnimatePresence as AnimatePresence2, motion as motion5 } from "framer-motion";
import { useCallback, useEffect } from "react";
import { Fragment, jsx as jsx5, jsxs } from "react/jsx-runtime";
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
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );
  useEffect(() => {
    if (!open) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);
  return /* @__PURE__ */ jsx5(AnimatePresence2, { children: open && /* @__PURE__ */ jsxs(Fragment, { children: [
    backdrop && /* @__PURE__ */ jsx5(
      motion5.div,
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
    /* @__PURE__ */ jsx5(
      motion5.div,
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
import { useSpring, useTransform } from "framer-motion";
import { useEffect as useEffect2, useRef } from "react";
import { jsx as jsx6 } from "react/jsx-runtime";
var defaultFormat = (v) => Math.round(v).toLocaleString();
function CountUp({
  value,
  springConfig = { stiffness: 200, damping: 20 },
  format = defaultFormat,
  className
}) {
  const ref = useRef(null);
  const motionValue = useSpring(0, springConfig);
  const display = useTransform(motionValue, (latest) => format(latest));
  useEffect2(() => {
    motionValue.set(value);
  }, [value, motionValue]);
  useEffect2(() => {
    const unsubscribe = display.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = latest;
      }
    });
    return unsubscribe;
  }, [display]);
  return /* @__PURE__ */ jsx6("span", { ref, className });
}

// src/SkeletonTransition/index.tsx
import { AnimatePresence as AnimatePresence3, motion as motion6 } from "framer-motion";
import { jsx as jsx7 } from "react/jsx-runtime";
function SkeletonTransition({ isLoading, skeleton, children }) {
  return /* @__PURE__ */ jsx7(AnimatePresence3, { mode: "wait", children: isLoading ? /* @__PURE__ */ jsx7(
    motion6.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: transitions.fast,
      children: skeleton
    },
    "skeleton"
  ) : /* @__PURE__ */ jsx7(
    motion6.div,
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
export {
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
};
//# sourceMappingURL=index.js.map