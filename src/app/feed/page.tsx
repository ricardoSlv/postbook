import React from "react";

import { Post } from "../../types/Post";
import { User } from "../../types/User";
import Feed from "@/components/Feed";

export default async function FeedPage() {
  const postRes = await fetch("https://jsonplaceholder.typicode.com/posts/");
  //TODO: fetch current user from cookie
  const userRes = await fetch("https://jsonplaceholder.typicode.com/users/1");

  if (!postRes.ok || !userRes.ok) {
    throw new Error("Failed to fetch data");
  }

  const posts = (await postRes.json()) as Array<Post>;
  const currentUser = (await userRes.json()) as User;

  return <Feed posts={posts} currentUser={currentUser} />;
}
