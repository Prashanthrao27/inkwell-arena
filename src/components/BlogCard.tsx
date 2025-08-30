import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Bookmark, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: Date;
  readTime: number;
  likes: number;
  comments: number;
  tags: string[];
  coverImage?: string;
  isBookmarked?: boolean;
  isLiked?: boolean;
}

export const BlogCard = ({
  title,
  excerpt,
  author,
  publishedAt,
  readTime,
  likes,
  comments,
  tags,
  coverImage,
  isBookmarked = false,
  isLiked = false,
}: BlogCardProps) => {
  return (
    <article className="blog-card bg-card rounded-lg overflow-hidden border border-border hover:border-primary/20 group">
      {/* Cover Image */}
      {coverImage && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="icon"
              className={`bg-background/80 backdrop-blur-sm ${
                isBookmarked ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 2}
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-card-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-muted-foreground mb-4 line-clamp-3">{excerpt}</p>

        {/* Author and Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-card-foreground">
                {author.name}
              </span>
              <div className="flex items-center text-xs text-muted-foreground space-x-2">
                <span>{formatDistanceToNow(publishedAt)} ago</span>
                <span>•</span>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {readTime} min read
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className={`text-xs ${
                isLiked ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              <Heart className="h-4 w-4 mr-1" />
              {likes}
            </Button>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              <MessageCircle className="h-4 w-4 mr-1" />
              {comments}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};