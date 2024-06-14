"use client";
import React, { useCallback, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import SideNav from "@/components/SideNav";
import HeaderSection from "@/components/HeaderSection";
import { User } from "@/types/User";
import PostCard from "./PostCard";
import { Post } from "@/types/Post";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { CreatePostDialog } from "./CreatePostDialog";
import { UserContext } from "./contexts/userContext";

const DEFAULT_POSTS_SHOWN = 3;

const queryClient = new QueryClient();

export default function Feed(props: { currentUser: User; posts: Post[] }) {
  const [currentPosts, setCurrentPosts] = useState(props.posts);
  const [page, setPage] = useState(0);

  const onPostCreated = useCallback(async (post: Post) => {
    setCurrentPosts((currentPosts) => [post, ...currentPosts]);
    setPage(0);
  }, []);

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
                <CreatePostDialog onPostCreated={onPostCreated} />
              </div>
              <div className="flex flex-col flex-1 justify-center items-stretch gap-6">
                {currentPosts
                  .slice(page * DEFAULT_POSTS_SHOWN, page * DEFAULT_POSTS_SHOWN + DEFAULT_POSTS_SHOWN)
                  .map((post) => (
                    <PostCard key={post.id} {...post} />
                  ))}
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" onClick={() => setPage((p) => Math.max(p - 1, 0))} />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">{page + 1}</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() =>
                        setPage((p) => Math.min(p + 1, Math.floor(props.posts.length / DEFAULT_POSTS_SHOWN)))
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </main>
          </div>
        </div>
      </UserContext.Provider>
    </QueryClientProvider>
  );
}
