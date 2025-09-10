import React, { useEffect, useRef } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
 
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface Props {
  AIResult: string;
}

function OutputSection({ AIResult }: Props) {
  // Ref is typed to Editor component's instance (null initially)
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (editorRef.current) {
      // Get the instance of the editor from the ref
      const editorInstance = editorRef.current.getInstance();
      editorInstance.setMarkdown(AIResult); // Set the markdown content
    }
  }, [AIResult]);

  return (
    <div className="bg-white shadow-lg border rounded-lg">
      <div className="flex justify-between items-center p-5">
        <h2 className="font-medium text-lg">Your Result</h2>
        <Button
          className="flex gap-2"
          onClick={() => navigator.clipboard.writeText(AIResult)}
        >
          <Copy className="w-4 h-4" />
          Copy
        </Button>
      </div>
      <Editor
        ref={editorRef}
        initialValue="Your result will appear here"
        height="600px"
        initialEditType="wysiwyg"
        useCommandShortcut={true}
        onChange={() =>
          console.log(editorRef.current?.getInstance().getMarkdown()) // Get the markdown on change
        }
      />
    </div>
  );
}

export default OutputSection;
