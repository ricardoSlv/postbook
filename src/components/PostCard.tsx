"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Comment } from "@/types/Comment";
import CommentSection from "@/components/CommentSection";
import { Post } from "@/types/Post";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";

export default function PostCard(props: Post) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.userId}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{props.body}</p>
      </CardContent>
      <CardFooter className="justify-end">
        <PostDialog {...props} />
      </CardFooter>
    </Card>
  );
}

export function PostDialog(props: Post) {
  const { isPending, error, data } = useQuery<Comment[]>({
    queryKey: ["postComments" + props.id],
    queryFn: () => fetch(`https://jsonplaceholder.typicode.com/posts/${props.id}/comments`).then((res) => res.json()),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1025px] h-5/6">
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogDescription>{props.userId}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 grid md:grid-cols-[1fr_330px] lg:grid-cols-[1fr_420px] min-h-0">
          <div>
            <p>{props.body}</p>
          </div>
          {/* //loader skeleton */}
          <div className="h-full overflow-y-scroll [@media(min-width:100px)]:scrollbar-hide">
            <CommentSection postId={props.id} comments={data} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
