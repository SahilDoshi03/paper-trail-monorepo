import { RenderElementProps } from "slate-react";

const CodeElement = ({attributes, children}: RenderElementProps) => {
  return (
    <pre {...attributes}>
      <code>{children}</code>
    </pre>
  );
};

export default CodeElement
