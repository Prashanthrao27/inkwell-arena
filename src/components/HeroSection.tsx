import { Button } from "@/components/ui/button";
import { PenTool, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/blog-hero.jpg";

export const HeroSection = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient opacity-90"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Share Your Stories,
              <span className="block text-accent-light">Inspire the World</span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Join our community of passionate writers and readers. Create, discover, and share 
              amazing stories that matter.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button variant="outline" size="lg" className="bg-white text-primary border-white hover:bg-white/90" asChild>
                <Link to="/signup">
                  <PenTool className="mr-2 h-5 w-5" />
                  Start Writing
                </Link>
              </Button>
              <Button variant="ghost" size="lg" className="text-white border-white/20 hover:bg-white/10" asChild>
                <Link to="/explore">
                  Explore Stories
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-white mb-1">10K+</div>
                <div className="text-white/80 text-sm">Articles Published</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">5K+</div>
                <div className="text-white/80 text-sm">Active Writers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">50K+</div>
                <div className="text-white/80 text-sm">Happy Readers</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-lg overflow-hidden shadow-2xl animate-float">
              <img
                src={heroImage}
                alt="Blogging workspace"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-6 -left-6 bg-white rounded-lg p-4 shadow-lg animate-bounce">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <span className="font-medium text-sm">Trending Now</span>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 bg-white rounded-lg p-4 shadow-lg animate-bounce" style={{ animationDelay: "1s" }}>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-medium text-sm">Join Community</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};