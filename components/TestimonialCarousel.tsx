"use client";

import { useRef, useEffect, useState } from "react";

interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const currentTranslateRef = useRef(0);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let animationId: number;
    const cardWidth = 384 + 24; // w-96 (384px) + gap (24px)
    const totalWidth = cardWidth * testimonials.length;
    const speed = 0.7; // pixels per frame

    const animate = () => {
      // Only update position when not hovering
      if (!isHovering) {
        currentTranslateRef.current -= speed;

        // When we've scrolled through both sets, reset to start for seamless loop
        if (currentTranslateRef.current <= -totalWidth * 2) {
          currentTranslateRef.current = 0;
        }
      }

      carousel.style.transform = `translateX(${currentTranslateRef.current}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [testimonials.length, isHovering]);

  return (
    <div 
      className="mt-12 overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        ref={carouselRef}
        className="flex space-x-6 transition-transform"
        style={{ willChange: "transform" }}
      >
        {/* First set of testimonials */}
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="carousel-card w-80 shrink-0 rounded-2xl border border-dental-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:border-dental-primary sm:w-96"
          >
            <div className="flex items-center gap-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <span key={i} className="text-dental-primary text-lg">
                  ★
                </span>
              ))}
            </div>
            <p className="text-dental-gray-700 mb-6 leading-relaxed">
              "{testimonial.text}"
            </p>
            <div className="border-t border-dental-gray-100 pt-4">
              <p className="font-semibold text-dental-gray-900">
                {testimonial.name}
              </p>
              <p className="text-sm text-dental-primary">
                {testimonial.role}
              </p>
            </div>
          </div>
        ))}

        {/* Duplicate set for seamless loop */}
        {testimonials.map((testimonial, index) => (
          <div
            key={`duplicate-${index}`}
            className="carousel-card w-80 shrink-0 rounded-2xl border border-dental-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:border-dental-primary sm:w-96"
          >
            <div className="flex items-center gap-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <span key={i} className="text-dental-primary text-lg">
                  ★
                </span>
              ))}
            </div>
            <p className="text-dental-gray-700 mb-6 leading-relaxed">
              "{testimonial.text}"
            </p>
            <div className="border-t border-dental-gray-100 pt-4">
              <p className="font-semibold text-dental-gray-900">
                {testimonial.name}
              </p>
              <p className="text-sm text-dental-primary">
                {testimonial.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
