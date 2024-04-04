"use client";

import { Command, CommandEmpty, CommandInput, CommandList } from "./ui/command";
import { useState } from "react";

const Searchbar = () => {
  const [input, setInput] = useState("");

  return (
    <div className="bg-background py-2 pl-8">
      <Command className="max-w-lg border bg-slate-800 focus-within:border-primary focus-within:bg-background">
        <CommandInput placeholder="Search" size={32} />
        {input.length > 0 && (
          <CommandList>
            <CommandEmpty className="px-8 text-sm text-muted-foreground">
              Try searching for people, lists, or keywords
            </CommandEmpty>
          </CommandList>
        )}
      </Command>
    </div>
  );
};

export default Searchbar;
