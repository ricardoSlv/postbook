"use client";

import { SyntheticEvent, useCallback, useContext, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Search, Send } from "lucide-react";
import { Comment } from "@/types/Comment";
import { Input } from "@/components/ui/input";
import { UserContext } from "./Feed";

const DEFAULT_COMMENTS_SHOWN = 3;
const COMMENTS_SHOWN_INCREMENT = 2;

export default function CommentSection(props: { postId: number; comments: Comment[] }) {
  const currentUser = useContext(UserContext);

  const [nrCommentsShown, setNrCommentsShown] = useState(DEFAULT_COMMENTS_SHOWN);
  const [comments, setComments] = useState(props.comments);

  const onSubmitComment = useCallback(
    async (commentText: string) => {
      if (currentUser === null) {
        alert("You need to login to add a comment");
        return;
      }
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${props.postId}/comments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postId: props.postId, email: currentUser.email, body: commentText }),
        });
        if (response.ok) {
          const newComment = await response.json();
          setComments((prevComments) => [newComment, ...prevComments]);
          setNrCommentsShown((n) => n + 1);
          //TODO: Scroll to top
        } else {
          console.error("Failed to submit comment");
        }
      } catch (error) {
        console.error("Failed to submit comment", error);
      }
    },
    [currentUser, props.postId]
  );

  return (
    <>
      {comments.slice(0, nrCommentsShown).map((comment) => (
        <CommentCard key={comment.id} {...comment} />
      ))}
      {nrCommentsShown < comments.length ? (
        <Button
          variant="link"
          className="ml-auto"
          onClick={() => setNrCommentsShown((n) => n + COMMENTS_SHOWN_INCREMENT)}
        >
          Show {COMMENTS_SHOWN_INCREMENT} more
        </Button>
      ) : null}
      <AddCommentForm onSubmitComment={onSubmitComment} />
    </>
  );
}

function CommentCard(props: Comment) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.name}</CardTitle>
        <CardDescription>{props.email.split("@")[0]}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{props.body}</p>
      </CardContent>
    </Card>
  );
}

function AddCommentForm(props: { onSubmitComment: (text: string) => void }) {
  const [commentText, setcommentText] = useState("");
  return (
    <div className="flex-1 w-full">
      <form
        className="flex flex-row"
        onSubmit={(e: SyntheticEvent) => {
          e.preventDefault();
          if (commentText.length > 0) {
            console.log(commentText);
            props.onSubmitComment(commentText);
          }
        }}
      >
        <div className="relative flex-1 min-w-0">
          <Search className="top-2.5 left-2.5 absolute w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Add a comment..."
            className="shadow-none pl-8 w-full appearance-none outline-none"
            value={commentText}
            onChange={(e) => {
              setcommentText(e.target.value);
            }}
          />
        </div>
        <Button variant="ghost" type="submit">
          <Send />
        </Button>
      </form>
    </div>
  );
}
