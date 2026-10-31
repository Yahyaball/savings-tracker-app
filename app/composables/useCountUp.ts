import {
  useInView,
  useMotionValue,
  animate,
  useMotionValueEvent,
} from "motion-v";
import { computed, ref, unref, watch, type MaybeRef } from "vue";

export interface UseCountUpOptions {
  duration?: number;
  ease?: number[];
  once?: boolean;
  rootMargin?: string;
  start?: number;
  decimals?: number;
  format?: "number" | "percent" | "currency";
  locale?: string;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  prefix?: string;
  suffix?: string;
  formatter?: (value: number) => string;
  clamp?: boolean;
  min?: number;
  max?: number;
}

export function useCountUp(
  target: MaybeRef<number> | (() => number),
  options: UseCountUpOptions & { trigger?: MaybeRef<boolean> } = {},
) {
  const {
    duration = 0.8,
    ease = [0.25, 0.1, 0.25, 1],
    once = true,
    rootMargin = "0px",
    start = 0,
    decimals = 0,
    format = "number",
    locale = "en-US",
    currency = "USD",
    minimumFractionDigits,
    maximumFractionDigits,
    prefix = "",
    suffix = "",
    formatter,
    clamp = false,
    min = 0,
    max,
    trigger,
  } = options;

  const el = ref<HTMLElement | null>(null);
  const isInViewLocal = useInView(el, { once, margin: rootMargin });
  const isInView = computed(() => {
    if (trigger !== undefined) {
      return unref(trigger);
    }
    return isInViewLocal.value;
  });

  const count = useMotionValue(start);

  const targetValue = computed(() => {
    let val: number;
    if (typeof target === "function") {
      val = target();
    } else {
      val = unref(target);
    }
    if (typeof val !== "number" || Number.isNaN(val)) val = 0;

    if (clamp) {
      val = Math.max(min, max !== undefined ? Math.min(val, max) : val);
    }

    return val;
  });

  const numberFormatter = computed(() => {
    if (format === "currency") {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: minimumFractionDigits ?? 2,
        maximumFractionDigits: maximumFractionDigits ?? 2,
      });
    }

    if (format === "percent") {
      return new Intl.NumberFormat(locale, {
        style: "percent",
        minimumFractionDigits: minimumFractionDigits ?? decimals,
        maximumFractionDigits: maximumFractionDigits ?? decimals,
      });
    }

    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: minimumFractionDigits ?? decimals,
      maximumFractionDigits: maximumFractionDigits ?? decimals,
    });
  });

  const formatValue = (latest: number) => {
    if (formatter) return formatter(latest);

    if (format === "percent") {
      return numberFormatter.value.format(latest / 100);
    }

    if (format === "currency") {
      return numberFormatter.value.format(latest);
    }

    const formatted = numberFormatter.value.format(latest);
    return `${prefix}${formatted}${suffix}`;
  };

  const display = ref(formatValue(start));

  useMotionValueEvent(count, "change", (latest) => {
    display.value = formatValue(latest);
  });

  const startAnimation = () => {
    count.set(start);
    animate(count, targetValue.value, {
      duration,
      ease,
    } as any);
  };

  watch(
    isInView,
    (inView) => {
      if (inView) {
        startAnimation();
      }
    },
  );

  watch(targetValue, () => {
    if (unref(isInView as any)) {
      startAnimation();
    }
  });

  return {
    el,
    count,
    display,
    isInView,
    start: startAnimation,
  };
}
