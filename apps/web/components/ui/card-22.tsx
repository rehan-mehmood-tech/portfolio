"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export type Card22Props = {
  title: string;
  description: string;
  eyebrow: string;
  meta?: string;
  image?: string;
  imageAlt?: string;
  visualLabel: string;
  actionLabel: string;
  actionHref?: string;
  external?: boolean;
};

const MotionCard = motion.create(Card);

export function Card22({
  title,
  description,
  eyebrow,
  meta,
  image,
  imageAlt,
  visualLabel,
  actionLabel,
  actionHref,
  external = false,
}: Card22Props) {
  const reduceMotion = useReducedMotion();

  return (
    <MotionCard
      className="card-22"
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -6 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
    >
      <div className="card-22-media">
        {image ? (
          <motion.img
            src={image}
            alt={imageAlt ?? visualLabel}
            loading="lazy"
            whileHover={reduceMotion ? undefined : { scale: 1.045 }}
            transition={{ duration: 0.45, ease: [0.2, 0, 0, 1] }}
          />
        ) : (
          <div className="card-22-visual" aria-label={visualLabel}>
            <span className="font-pixel">{visualLabel}</span>
            <i aria-hidden="true" />
          </div>
        )}
      </div>

      <CardHeader>
        <div className="card-22-kicker">
          <Badge variant="outline">{eyebrow}</Badge>
          {meta ? <span>{meta}</span> : null}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>

      <CardFooter>
        {actionHref ? (
          <Button asChild variant="outline" size="sm">
            <a href={actionHref} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
              {actionLabel}
              <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
            </a>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled aria-label={actionLabel + " unavailable"}>
            {actionLabel}
            <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
          </Button>
        )}
      </CardFooter>
    </MotionCard>
  );
}
