"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "./ui/button";
import { SyntheticEvent, useCallback, useContext, useState } from "react";
import { MessageSquareText } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Post } from "@/types/Post";
import { UserContext } from "./contexts/userContext";

export function CreatePostDialog({ onPostCreated }: { onPostCreated: (post: Post) => void }) {
  const currentUser = useContext(UserContext);

  const onSubmitPost = useCallback(
    async (postTitle: string, postText: string) => {
      if (currentUser === null) {
        alert("You need to login to add a comment");
        return;
      }
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser.id,
            title: postTitle,
            body: postText,
          }),
        });
        if (response.ok) {
          const newPost = await response.json();
          //TODO: Schema validate
          onPostCreated(newPost);
        } else {
          console.error("Failed to submit post");
        }
      } catch (error) {
        console.error("Failed to submit post", error);
      }
    },
    [currentUser, onPostCreated]
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Post</Button>
      </DialogTrigger>
      <DialogContent className="gap-12 grid-rows-[auto_1fr] sm:max-w-[1025px] h-5/6">
        <DialogHeader>
          <DialogTitle>Create your post, speak your mind</DialogTitle>
          <DialogDescription>Within the terms of use 🫣</DialogDescription>
        </DialogHeader>
        <AddPostForm onSubmitComment={onSubmitPost} />
      </DialogContent>
    </Dialog>
  );
}

export function AddPostForm(props: { onSubmitComment: (title: string, text: string) => void }) {
  const [postTitle, setPostTitle] = useState("");
  const [postText, setPostText] = useState("");

  return (
    <form
      className="flex flex-col justify-between gap-3 w-full"
      onSubmit={(e: SyntheticEvent) => {
        e.preventDefault();
        if (postTitle.length > 0 && postText.length > 0) {
          setPostText("");
          setPostTitle("");
          props.onSubmitComment(postTitle, postText);
        }
      }}
    >
      <div className="flex flex-row">
        <div className="relative flex-1 min-w-0">
          <MessageSquareText className="top-2.5 left-2.5 absolute w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Give your post a catchy title..."
            className="shadow-none mb-1 pl-8 w-full appearance-none outline-none"
            value={postTitle}
            onChange={(e) => {
              setPostTitle(e.target.value);
            }}
          />
        </div>
      </div>
      <Textarea
        className="flex-1"
        placeholder="Write your post..."
        value={postText}
        onChange={(e) => {
          setPostText(e.target.value);
        }}
      />
      <div className="flex justify-end mt-2">
        <Button className="px-5" type="submit" disabled={postTitle.length === 0 || postText.length === 0}>
          Post
        </Button>
      </div>
    </form>
  );
}
