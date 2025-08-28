import { RenderElementProps, useSlateStatic, ReactEditor } from "slate-react";
import { Transforms } from "slate";

const CheckboxElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  const editor = useSlateStatic();
  const { checked = false } = element;

  return (
    <div {...attributes} className="flex items-center">
      <input
        type="checkbox"
        checked={checked}
        contentEditable={false}
        onChange={(e) => {
          const path = ReactEditor.findPath(editor, element);
          Transforms.setNodes(
            editor,
            { checked: e.target.checked },
            {
              at: path,
            },
          );
          console.log("CHECKED", checked);
        }}
        className="mr-2"
      />
      <span className={checked ? "line-through" : ""}>{children}</span>
    </div>
  );
};

export default CheckboxElement;
