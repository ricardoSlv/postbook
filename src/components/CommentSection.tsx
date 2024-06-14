"use client";

import { SyntheticEvent, useCallback, useContext, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { MessageSquareText, Send } from "lucide-react";
import { Comment } from "@/types/Comment";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import { UserContext } from "./contexts/userContext";

const DEFAULT_COMMENTS_SHOWN = 3;
const COMMENTS_SHOWN_INCREMENT = 2;

export default function CommentSection(props: { postId: number; comments: Comment[] }) {
  const currentUser = useContext(UserContext);

  const [nrCommentsShown, setNrCommentsShown] = useState(DEFAULT_COMMENTS_SHOWN);
  const [comments, setComments] = useState(props.comments);

  const onSubmitComment = useCallback(
    async (commentName: string, commentText: string) => {
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
          body: JSON.stringify({
            postId: props.postId,
            email: currentUser.email,
            name: commentName,
            body: commentText,
          }),
        });
        if (response.ok) {
          const newComment = await response.json();
          setComments((prevComments) => [
            ...prevComments.slice(0, nrCommentsShown),
            newComment,
            ...prevComments.slice(nrCommentsShown, prevComments.length),
          ]);
          setNrCommentsShown((n) => n + 1);
          //TODO: Scroll to top
        } else {
          console.error("Failed to submit comment");
        }
      } catch (error) {
        console.error("Failed to submit comment", error);
      }
    },
    [currentUser, nrCommentsShown, props.postId]
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
    <Card className="mb-2">
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

export function AddCommentForm(props: { onSubmitComment: (commentName: string, commentText: string) => void }) {
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");

  return (
    <div className="flex-1 w-full">
      <form
        className="flex flex-col"
        onSubmit={(e: SyntheticEvent) => {
          e.preventDefault();
          if (commentName.length > 0 && commentText.length > 0) {
            setCommentText("");
            setCommentName("");
            props.onSubmitComment(commentName, commentText);
          }
        }}
      >
        <div className="flex flex-row flex-1">
          <div className="relative flex-1 min-w-0">
            <MessageSquareText className="top-2.5 left-2.5 absolute w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Give your comment a name..."
              className="shadow-none mb-1 pl-8 w-full appearance-none outline-none"
              value={commentName}
              onChange={(e) => {
                setCommentName(e.target.value);
              }}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            type="submit"
            disabled={commentName.length === 0 || commentText.length === 0}
          >
            <Send />
          </Button>
        </div>
        <Textarea
          placeholder="Write your comment..."
          value={commentText}
          onChange={(e) => {
            setCommentText(e.target.value);
          }}
        />
      </form>
    </div>
  );
}
