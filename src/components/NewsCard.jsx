import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink } from "lucide-react";

const NewsCard = ({ article }) => {
  const { title, description, urlToImage, url, source, publishedAt, category } =
    article;

  const imageUrl =
    urlToImage ||
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80";

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const categoryColors = {
    business: "bg-blue-600",
    entertainment: "bg-pink-600",
    general: "bg-gray-600",
    health: "bg-green-600",
    science: "bg-purple-600",
    sports: "bg-orange-600",
    technology: "bg-indigo-600",
  };

  const badgeColor = categoryColors[category?.toLowerCase()] || "bg-gray-600";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl group cursor-pointer">
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => (e.currentTarget.src = imageUrl)}
          />

          {/* Category Badge */}
          <Badge className={`absolute top-3 right-3 ${badgeColor}`}>
            {category || "General"}
          </Badge>
        </div>

        {/* Title */}
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </CardHeader>

        {/* Description */}
        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {description || "No description available."}
          </p>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex items-center justify-between border-t pt-3">
          {/* Source */}
          <span className="text-sm font-medium truncate">
            {source?.name || "Unknown Source"}
          </span>

          {/* Date & Link */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(publishedAt)}</span>
            </div>
            <ExternalLink className="h-4 w-4 group-hover:text-primary" />
          </div>
        </CardFooter>
      </Card>
    </a>
  );
};

export default NewsCard;
