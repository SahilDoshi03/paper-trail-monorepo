import { RenderElementProps } from "slate-react";

const BulletedListElement = ({ attributes, children }: RenderElementProps) => {
  return (
    <ul {...attributes} className="list-disc pl-6">
      {children}
    </ul>
  );
};

export default BulletedListElement;

