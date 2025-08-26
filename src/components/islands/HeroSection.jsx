// src/components/islands/HeroSection.jsx
import { Button } from '@/components/ui/button';

const HeroSection = ({ headline, subhead, imageUrl, imageAlt, ctaText, ctaTarget }) => {
  return (
    <div className="relative w-full min-h-[500px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
      <img
        src={imageUrl}
        alt={imageAlt}
        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
      />
      <div className="relative z-10 container mx-auto flex flex-col items-center justify-center min-h-[500px] px-4 text-center">
        {/* Dynamic Copy */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {headline}
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-2xl text-foreground/90">
          {subhead}
        </p>

        {/* Primary CTA */}
        <Button
          size="lg"
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-8 py-6 text-lg rounded-full transition-all duration-300 transform hover:scale-105"
        >
          <a href={ctaTarget}>{ctaText}</a>
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
