"use client";
import { FeedStatusType } from "@/types/feed";
import { useState, createContext, useContext } from "react";
import { create } from "zustand";

const createStore = (feedStatus: FeedStatusType) =>
  create<{
    feedStatus: FeedStatusType;
    setFeedStatus: (feedStatus: FeedStatusType) => void;
  }>((set) => ({
    feedStatus,
    setFeedStatus(feedStatus: FeedStatusType) {
      set({ feedStatus });
    },
  }));

const FeedStatusContext = createContext<ReturnType<typeof createStore> | null>(
  null,
);

export const useFeedStatus = () => {
  if (!FeedStatusContext)
    throw new Error("useFeedStatus must be used within a FeedStatusProvider");
  return useContext(FeedStatusContext)!;
};

const FeedStatusProvider = ({ children }: { children: React.ReactNode }) => {
  const [store] = useState(() => createStore("all"));

  return (
    <FeedStatusContext.Provider value={store}>
      {children}
    </FeedStatusContext.Provider>
  );
};

export default FeedStatusProvider;
