import React, { useEffect, useRef, useState } from "react";
// @ts-ignore
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
  const [toast, setToast] = useState<{ visible: boolean, message: string }>({ visible: false, message: "" });
  
  const showToast = (message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast({ visible: false, message: "" });
    }, 3000); // Hide after 3 seconds
  };

  useEffect(() => {
    if (editorRef.current) {
      // Get the instance of the editor from the ref
      const editorInstance = editorRef.current.getInstance();
      editorInstance.setMarkdown(AIResult); // Set the markdown content
    }
  }, [AIResult]);

  return (
    <div className="bg-white shadow-lg border rounded-lg relative">
      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed bottom-5 right-5 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-5">
          <Copy size={18} />
          <span>{toast.message}</span>
        </div>
      )}
      
      <div className="flex justify-between items-center p-5">
        <h2 className="font-medium text-lg">Your Result</h2>
        <Button
          className="flex gap-2 bg-indigo-500 hover:bg-indigo-600 text-white"
          onClick={() => {
            navigator.clipboard.writeText(AIResult);
            showToast("Content copied to clipboard!");
          }}
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
