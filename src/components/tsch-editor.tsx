import type { Question } from "@/lib/question";
import { Editor, type EditorProps, type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useEffect, useRef } from "react";
import { useTypeDefs } from "./providers";
import { IconLoader2 } from "@tabler/icons-react";

type Props = { question: Question };

export const TschEditor: React.FC<Props> = ({ question }) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const typeDefs = useTypeDefs();

  const handleMount: EditorProps["onMount"] = async (editor, monaco) => {
    // typeDefsがundefinedのときにhandleMountが実行されないように、条件分岐でレンダリングさせる必要がある
    if (!typeDefs) {
      return;
    }

    editorRef.current = editor;
    monacoRef.current = monaco;

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
    });

    Array.from(typeDefs.entries()).forEach(([moduleName, typeDef]) => {
      monaco.editor.createModel(
        typeDef,
        "typescript",
        monaco.Uri.parse(`file:///node_modules/${moduleName}/index.d.ts`)
      );
    });
  };

  useEffect(() => {
    return () => {
      if (!monacoRef.current) {
        return;
      }

      monacoRef.current.editor.getModels().forEach((m) => {
        m.dispose();
      });
    };
  }, []);

  return (
    typeDefs && (
      <Editor
        path={`file:///${question.title}.ts`}
        width="100%"
        height="100%"
        language="typescript"
        theme="vs-dark"
        className="border border-border rounded-lg overflow-hidden"
        onMount={handleMount}
        defaultValue={question.code}
        loading={<IconLoader2 className="animate-spin size-8" />}
      />
    )
  );
};
