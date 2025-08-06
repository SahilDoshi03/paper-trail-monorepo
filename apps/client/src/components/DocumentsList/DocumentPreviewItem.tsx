"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { createDocument } from "@/actions/Document";
import { CiMenuKebab } from "react-icons/ci";
import Popover from "@/components/common/Popover";
import DocumentListMenuPopover from "./DocumentListMenuPopover";
import { useSession } from "next-auth/react";

type DocumentPreviewItemProps = {
  image: string;
  title: string;
  docId?: string;
};

const DocumentPreviewItem = ({
  image,
  title,
  docId,
}: DocumentPreviewItemProps) => {
  const { data: userData } = useSession();
  const router = useRouter();

  const userId = userData?.user?.id;

  if (!userId) {
    return;
  }

  const handleClick = async () => {
    if (docId) {
      router.push(`/${docId}`);
    } else {
      const document = await createDocument(userId);
      if (document) {
        router.push(`/${document.id}`);
      }
    }
  };

  return (
    <div className="w-[200px] flex flex-col rounded-sm border-1">
      <Image
        className="cursor-pointer"
        src={image}
        alt={`${title} preview image`}
        height={300}
        width={200}
        onClick={handleClick}
      />
      <div className="flex items-center justify-between p-2">
        <div
          className="cursor-pointer p-2 max-w-[160px] truncate text-nowrap text-ellipsis"
          onClick={handleClick}
        >
          {title}
        </div>
        {docId && (
          <Popover
            trigger={
              <button
                data-modal-target="default-modal"
                data-modal-toggle="default-modal"
                className="icon-btn"
                type="button"
              >
                <CiMenuKebab size={20} />
              </button>
            }
          >
            <DocumentListMenuPopover userId={userId} docId={docId} />
          </Popover>
        )}
      </div>
    </div>
  );
};

export default DocumentPreviewItem;
