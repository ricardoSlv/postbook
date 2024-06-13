"use client";
import React, { createContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import SideNav from "@/components/SideNav";
import HeaderSection from "@/components/HeaderSection";
import { User } from "@/types/User";
import { Button } from "./ui/button";
import PostCard from "./PostCard";
import { Post } from "@/types/Post";

export const UserContext = createContext<User | null>(null);
const queryClient = new QueryClient();

export default function Feed(props: { currentUser: User; posts: Post[] }) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={props.currentUser}>
        <div className="flex flex-col items-stretch w-full h-screen">
          <HeaderSection />
          <div className="flex-1 grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] min-h-0">
            <div className="md:block hidden bg-muted/40 border-r">
              <SideNav textSize="text-sm" />
            </div>
            <main className="flex flex-col gap-4 lg:gap-6 p-4 lg:p-6 overflow-y-scroll">
              <div className="flex justify-between items-center">
                <h1 className="font-semibold text-lg md:text-2xl">Feed</h1>
                <Button>Add Post</Button>
              </div>
              <div className="flex flex-col flex-1 justify-center items-stretch gap-6">
                {props.posts.map((post) => (
                  <PostCard key={post.id} {...post} />
                ))}
              </div>
            </main>
          </div>
        </div>
      </UserContext.Provider>
    </QueryClientProvider>
  );
}
