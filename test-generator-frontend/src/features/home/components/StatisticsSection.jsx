"use client";

import { useEffect, useRef, useState } from "react";
import { Card, Container, Heading } from "@/components/ui";
import { homeStats } from "@/data/home";
import { cn } from "@/utils";

/**
 * Animates a number from 0 → target when the element enters the viewport.
 */
function useCountUp(target, enabled, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) return undefined;

    let frameId = 0;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(target * eased));
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [target, enabled, duration]);

  return value;
}

function StatCard({ label, value, suffix = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const display = useCountUp(value, visible);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <Card
        className={cn(
          "text-center transition-opacity duration-500",
          visible ? "opacity-100" : "opacity-80",
        )}
      >
        <p className="text-display font-bold tracking-tight text-primary-700 tabular-nums">
          {display.toLocaleString()}
          {suffix}
        </p>
        <p className="mt-2 text-small font-medium text-neutral-600">{label}</p>
      </Card>
    </div>
  );
}

/**
 * Library scale statistics with viewport-triggered count-up.
 */
export function StatisticsSection() {
  return (
    <section className="bg-neutral-0 py-16 sm:py-20">
      <Container>
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <Heading level="h2">A growing question library</Heading>
          <p className="mt-3 text-body text-neutral-600">
            Dummy metrics that preview how rich your curriculum bank can feel
            once content is connected.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {homeStats.map((stat) => (
            <li key={stat.id}>
              <StatCard
                label={stat.label}
                value={stat.value}
                suffix={stat.suffix}
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
