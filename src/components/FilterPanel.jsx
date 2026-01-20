import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, X, CheckCircle } from "lucide-react";

const FilterPanel = ({
  filters = { category: "all", language: "en", from: "", to: "", source: "" },
  onFilterChange,
  onClearFilters,
}) => {
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "business", label: "Business" },
    { value: "entertainment", label: "Entertainment" },
    { value: "general", label: "General" },
    { value: "health", label: "Health" },
    { value: "science", label: "Science" },
    { value: "sports", label: "Sports" },
    { value: "technology", label: "Technology" },
  ];

  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "pt", label: "Portuguese" },
  ];

  // Check if filters are active
  const hasActiveFilters =
    filters.category !== "all" ||
    filters.language !== "en" ||
    filters.from ||
    filters.to ||
    filters.source;

  return (
    <Card className="mb-6 border-2 border-blue-100">
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            Filters{" "}
            {hasActiveFilters && (
              <CheckCircle className="w-4 h-4 text-green-600" />
            )}
          </CardTitle>
          {hasActiveFilters && (
            <span className="text-sm text-green-600 font-medium">✓ Active</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              Category
              {filters.category !== "all" && (
                <span className="text-xs text-green-600">✓</span>
              )}
            </label>
            <Select
              value={filters.category}
              onValueChange={(value) => onFilterChange("category", value)}
            >
              <SelectTrigger
                className={filters.category !== "all" ? "border-green-500" : ""}
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Language Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              Language
              {filters.language !== "en" && (
                <span className="text-xs text-green-600">✓</span>
              )}
            </label>
            <Select
              value={filters.language}
              onValueChange={(value) => onFilterChange("language", value)}
            >
              <SelectTrigger
                className={filters.language !== "en" ? "border-green-500" : ""}
              >
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* From Date */}
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              From Date
              {filters.from && (
                <span className="text-xs text-green-600">✓</span>
              )}
            </label>
            <Input
              type="date"
              value={filters.from || ""}
              onChange={(e) => onFilterChange("from", e.target.value)}
              className={filters.from ? "border-green-500" : ""}
            />
          </div>

          {/* To Date */}
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              To Date
              {filters.to && <span className="text-xs text-green-600">✓</span>}
            </label>
            <Input
              type="date"
              value={filters.to || ""}
              onChange={(e) => onFilterChange("to", e.target.value)}
              className={filters.to ? "border-green-500" : ""}
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="mt-4 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
          >
            <X className="w-4 h-4 mr-2" />
            Clear All Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
