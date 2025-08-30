import { NavBar } from "@/components/NavBar";
import { HeroSection } from "@/components/HeroSection";
import { BlogCard } from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Star, Clock, Filter } from "lucide-react";

// Mock data - Replace with real data from your backend
const featuredBlogs = [
  {
    id: "1",
    title: "The Future of Web Development: What's Coming in 2024",
    excerpt: "Explore the latest trends and technologies that will shape web development in the coming year. From AI integration to new frameworks...",
    author: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face"
    },
    publishedAt: new Date("2024-01-15"),
    readTime: 8,
    likes: 245,
    comments: 32,
    tags: ["Web Development", "Technology", "AI"],
    coverImage: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop"
  },
  {
    id: "2",
    title: "Building Scalable React Applications: Best Practices",
    excerpt: "Learn how to structure your React applications for maximum scalability and maintainability. This comprehensive guide covers...",
    author: {
      name: "Mike Johnson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    },
    publishedAt: new Date("2024-01-12"),
    readTime: 12,
    likes: 189,
    comments: 24,
    tags: ["React", "JavaScript", "Architecture"],
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop"
  },
  {
    id: "3",
    title: "The Art of Technical Writing: A Developer's Guide",
    excerpt: "Improve your technical communication skills and learn how to write documentation that developers actually want to read...",
    author: {
      name: "Emma Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
    },
    publishedAt: new Date("2024-01-10"),
    readTime: 6,
    likes: 156,
    comments: 18,
    tags: ["Writing", "Documentation", "Career"],
    coverImage: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=400&h=250&fit=crop"
  }
];

const trendingBlogs = [
  {
    id: "4",
    title: "Understanding Microservices Architecture",
    excerpt: "A deep dive into microservices patterns and when to use them...",
    author: {
      name: "David Park",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    },
    publishedAt: new Date("2024-01-08"),
    readTime: 15,
    likes: 312,
    comments: 45,
    tags: ["Architecture", "Backend", "DevOps"]
  },
  {
    id: "5",
    title: "CSS Grid vs Flexbox: When to Use What",
    excerpt: "Master the art of CSS layouts with this comprehensive comparison...",
    author: {
      name: "Lisa Wang",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face"
    },
    publishedAt: new Date("2024-01-05"),
    readTime: 10,
    likes: 278,
    comments: 34,
    tags: ["CSS", "Frontend", "Design"]
  }
];

const categories = ["All", "Technology", "Design", "Career", "Tutorial", "Opinion"];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Star className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">Featured Articles</h2>
            </div>
            <Button variant="outline">View All</Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBlogs.map((blog) => (
              <BlogCard key={blog.id} {...blog} />
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-12">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={category === "All" ? "default" : "secondary"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-2"
              >
                {category}
              </Badge>
            ))}
          </div>
        </section>

        {/* Trending and Latest */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Latest Articles */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Latest Articles</h2>
              </div>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="space-y-8">
              {[...featuredBlogs, ...trendingBlogs].map((blog) => (
                <BlogCard key={blog.id} {...blog} />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Articles
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Trending */}
            <div className="bg-content-card rounded-lg p-6 border border-border">
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-bold text-foreground">Trending Now</h3>
              </div>
              
              <div className="space-y-4">
                {trendingBlogs.map((blog, index) => (
                  <div key={blog.id} className="flex space-x-3">
                    <span className="text-2xl font-bold text-primary/30">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground hover:text-primary cursor-pointer transition-colors mb-1">
                        {blog.title}
                      </h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{blog.author.name}</span>
                        <span className="mx-2">•</span>
                        <span>{blog.likes} likes</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-content-card rounded-lg p-6 border border-border">
              <h3 className="text-xl font-bold text-foreground mb-6">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {["JavaScript", "React", "TypeScript", "Node.js", "CSS", "Python", "AI", "Web Design", "Tutorial", "Career"].map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3">Stay Updated</h3>
              <p className="text-primary-foreground/90 mb-4">
                Get the latest articles and insights delivered to your inbox.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 text-primary-foreground placeholder-primary-foreground/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <Button variant="outline" className="w-full bg-white text-primary border-white hover:bg-white/90">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}