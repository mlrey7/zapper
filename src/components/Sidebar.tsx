import React from "react";
import { Ellipsis } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendData {
  category: string;
  hashtag: string;
  postCountK: number;
}

const trends: Array<TrendData> = [
  {
    category: "Gaming",
    hashtag: "#LoremIpsum1",
    postCountK: 21,
  },
  {
    category: "Sports",
    hashtag: "#LoremIpsum2",
    postCountK: 324,
  },
  {
    category: "Technology",
    hashtag: "#LoremIpsum3",
    postCountK: 230,
  },
  {
    category: "Entertainment",
    hashtag: "#LoremIpsum4",
    postCountK: 89,
  },
  {
    category: "Gaming",
    hashtag: "#LoremIpsum5",
    postCountK: 21,
  },
  {
    category: "Sports",
    hashtag: "#LoremIpsum6",
    postCountK: 324,
  },
  {
    category: "Technology",
    hashtag: "#LoremIpsum7",
    postCountK: 230,
  },
  {
    category: "Entertainment",
    hashtag: "#LoremIpsum8",
    postCountK: 89,
  },
];

const Sidebar = () => {
  return (
    <div className="mt-16 flex flex-col gap-4 py-2 pl-8">
      <div className="rounded-lg bg-slate-800 px-4 py-4">
        <h2 className="mb-4 text-xl font-bold">Trends for you</h2>
        <div className="flex flex-col gap-4">
          {...trends.map((trend) => (
            <div key={trend.hashtag} className="flex flex-col">
              <div className="flex justify-between">
                <p className="text-xs text-gray-500">
                  {trend.category} • Trending
                </p>
                <Ellipsis
                  className={cn(
                    "h-4 w-4 cursor-pointer rounded-md text-gray-500 ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                  )}
                />
              </div>
              <h3 className="font-semibold">{trend.hashtag}</h3>
              <p className="text-xs text-gray-500">{trend.postCountK}K posts</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
