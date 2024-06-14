"use client";

import { SyntheticEvent, useCallback, useContext, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { MessageSquareText, Pencil, Send, Trash2 } from "lucide-react";
import { Comment } from "@/types/Comment";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import { UserContext } from "./contexts/userContext";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

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

  const onDeleteComment = useCallback(
    async (deletedCommentId: number) => {
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${props.postId}/comments/${deletedCommentId}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          setComments((comments) => comments.filter((comment) => comment.id !== deletedCommentId));
        } else {
          console.error("Failed to delete comment");
        }
      } catch (error) {
        console.error("Failed to delete comment", error);
      }
    },
    [props.postId]
  );

  const onUpdateComment = useCallback(
    async (updatedCommentId: number, commentName: string, commentText: string) => {
      try {
        const commentBeingUpdated = comments.find((c) => c.id === updatedCommentId);
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${props.postId}/comments/${updatedCommentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...commentBeingUpdated,
              name: commentName,
              body: commentText,
            }),
          }
        );
        if (response.ok) {
          const updatedComment = await response.json();
          setComments((comments) =>
            comments.filter((comment) => comment.id !== updatedCommentId).concat(updatedComment)
          );
        } else {
          console.error("Failed to delete comment");
        }
      } catch (error) {
        console.error("Failed to delete comment", error);
      }
    },
    [comments, props.postId]
  );

  return (
    <>
      {comments.slice(0, nrCommentsShown).map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          onDeleteComment={onDeleteComment}
          onUpdateComment={onUpdateComment}
        />
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

function CommentCard(props: {
  comment: Comment;
  onDeleteComment: (commentId: number) => void;
  onUpdateComment: (commentId: number, commentName: string, commentText: string) => void;
}) {
  const currentUser = useContext(UserContext);

  return (
    <Card className="mb-2">
      <CardHeader>
        <CardTitle className="flex justify-between items-top">
          {props.comment.name}
          {currentUser?.email === props.comment.email ? (
            <div className="text-slate-500">
              <UpdateCommentDialog
                comment={props.comment}
                onUpdateComment={(commentName: string, commentText: string) =>
                  props.onUpdateComment(props.comment.id, commentName, commentText)
                }
              />
              <DeleteCommentDialog onCommentDeleted={() => props.onDeleteComment(props.comment.id)} />
            </div>
          ) : null}
        </CardTitle>
        <CardDescription>{props.comment.email.split("@")[0]}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{props.comment.body}</p>
      </CardContent>
    </Card>
  );
}

function AddCommentForm(props: { onSubmitComment: (commentName: string, commentText: string) => void }) {
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

function DeleteCommentDialog(props: { onCommentDeleted: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <Trash2 className="h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>The world will miss your wisdom</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={props.onCommentDeleted}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function UpdateCommentDialog(props: {
  comment: Comment;
  onUpdateComment: (commentName: string, commentText: string) => void;
}) {
  const [commentName, setCommentName] = useState(props.comment.name);
  const [commentText, setCommentText] = useState(props.comment.body);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <Pencil className="h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update your comment</AlertDialogTitle>
          <AlertDialogDescription>Perfection takes time</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex-1 w-full">
          <form
            className="flex flex-col"
            onSubmit={(e: SyntheticEvent) => {
              e.preventDefault();
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
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => props.onUpdateComment(commentName, commentText)}>Update</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
