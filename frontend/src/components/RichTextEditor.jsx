import { useEffect, useRef } from "react";

const RichTextEditor = ({ value, onChange, id }) => {

  const editorRef = useRef(null);

  useEffect(() => {

    window.tinymce.init({
      selector: `#${id}`,
      height: 300,

      plugins: [
        "table",
        "lists",
        "link",
        "code"
      ],

      toolbar: "undo redo | formatselect | bold italic underline | forecolor backcolor | alignleft aligncenter alignright | bullist numlist | table | link | code",

      setup: (editor) => {

        editorRef.current = editor;

        editor.on("Change KeyUp", () => {
          onChange(editor.getContent());
        });
      }
    });

    return () => {
      window.tinymce.remove(`#${id}`);
    };

  }, []);

  return (
    <textarea id={id} defaultValue={value}></textarea>
  );
};

export default RichTextEditor;