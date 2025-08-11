import { RenderElementProps } from "slate-react";

const NumberedListElement = ({ attributes, children }: RenderElementProps) => {
  return (
    <ol {...attributes} className="list-decimal pl-6">
      {children}
    </ol>
  );
};

export default NumberedListElement;

