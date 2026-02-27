import { useEffect, useRef } from "react";

const RichTextEditor = ({ value, onChange, id }) => {

  const editorRef = useRef(null);

  useEffect(() => {

    window.tinymce.init({
      selector: `#${id}`,
      height: 300,
      plugins: ["table", "lists", "link", "code"],
      toolbar:
        "undo redo | formatselect | bold italic underline | forecolor backcolor | alignleft aligncenter alignright | bullist numlist | table | link | code",

      setup: (editor) => {

        editorRef.current = editor;

        editor.on("init", () => {
          editor.setContent(value || "");
        });

        editor.on("Change KeyUp", () => {
          onChange(editor.getContent());
        });
      },
    });

    return () => {
      if (window.tinymce.get(id)) {
        window.tinymce.get(id).remove();
      }
    };

  }, []);

  // 🔥 Sync when value changes (important)
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.getContent()) {
      editorRef.current.setContent(value || "");
    }
  }, [value]);

  return <textarea id={id}></textarea>;
};

export default RichTextEditor;