"use client";

import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense";
import { CollaborativeEditor } from "@/components/Editor/CollaborativeEditor";
import { getDocument, updateDocument } from "@/actions/Document";
import type { EditorDocument } from "@/lib/schemas/Document";
import { notFound, useParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GoArrowLeft } from "react-icons/go";

export default function Document() {
  const { data: userData, status: sessionStatus } = useSession();
  const router = useRouter();
  const params = useParams();
  const [docValue, setDocValue] = useState<EditorDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const docId = params.id as string;

  const userId = userData?.user?.id;

  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);

      if (!userId) {
        return;
      }

      const fetchedDoc = await getDocument(userId, docId);
      if (!fetchedDoc) {
        notFound();
      }
      setDocValue(fetchedDoc);
      setCurrentTitle(fetchedDoc.title);
      setLoading(false);
    };
    if (sessionStatus === "authenticated") {
      fetchDocument();
    }
  }, [docId, sessionStatus, userId, userData]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTitle(e.target.value);
  };

  const handleTitleBlur = async () => {
    setIsEditing(false);
    if (docValue && currentTitle !== docValue.title) {
      if (!userId) {
        return;
      }
      await updateDocument(userId, docId, { title: currentTitle });
      setDocValue({ ...docValue, title: currentTitle });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    }
  };

  if (loading) {
    return <div className="p-10">Loading document...</div>;
  }

  return (
    <div className="py-2 px-10">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div
            className="flex items-center gap-1 text-sm hover:bg-accent-action w-fit px-2 py-1 rounded-xs font-bold cursor-pointer"
            onClick={() => router.push("/")}
          >
            <GoArrowLeft />
            <span>back</span>
          </div>
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={currentTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={handleKeyDown}
              className="text-[2rem] outline-none border-b border-gray-300 focus:border-blue-500"
            />
          ) : (
            <h2
              className="text-[2rem] cursor-pointer"
              onClick={handleTitleClick}
            >
              {currentTitle}
            </h2>
          )}
        </div>
        <form
          action={async () => {
            router.push("/");
            await signOut();
          }}
          className="cursor-pointer"
        >
          <button className="p-2 rounded-sm hover:bg-accent-action cursor-pointer" type="submit">
            Sign Out
          </button>
        </form>
      </div>
      {docValue && (
        <div className="flex flex-col items-center justify-center">
          <LiveblocksProvider
            publicApiKey={
              "pk_dev_DYJpqEUIQdx448Q6y9zG3qY0SS1JGCfOqJA4yWsdtmesllY3mHU4JavReJKvq-Ou"
            }
          >
            <RoomProvider id={docId}>
              <ClientSideSuspense fallback={<div>Loading...</div>}>
                <CollaborativeEditor docId={docId} docValue={docValue} />
              </ClientSideSuspense>
            </RoomProvider>
          </LiveblocksProvider>
        </div>
      )}
    </div>
  );
}
