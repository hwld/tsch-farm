"use client";

import type { Question } from "@/lib/question";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { RouterProvider } from "react-aria-components";

const QuestionsContext = createContext<Question[] | undefined>(undefined);

export const useQuestions = (): Question[] => {
  const ctx = useContext(QuestionsContext);
  if (!ctx) {
    throw new Error("Providersが存在しません");
  }
  return ctx;
};

type ModuleName = string;
type TypeDefText = string;
type TypeDefs = Map<ModuleName, TypeDefText>;
const TypeDefsContext = createContext<TypeDefs | undefined>(undefined);

export const useTypeDefs = () => {
  const ctx = useContext(TypeDefsContext);
  return ctx;
};

type Props = { value: Question[] } & PropsWithChildren;

export const Providers: React.FC<Props> = ({ children, value }) => {
  const router = useRouter();
  const [typeDef, setTypeDef] = useState<TypeDefs>(new Map());

  useEffect(() => {
    const fetchTypeDef = async () => {
      const moduleName = "@type-challenges/utils";

      const res = await fetch(`https://esm.sh/${moduleName}`);
      const url = res.headers.get("x-typescript-types");
      if (!url) {
        return;
      }

      const typeDef = await (await fetch(url)).text();
      setTypeDef(new Map([[moduleName, typeDef]]));
    };

    fetchTypeDef();
  }, []);

  return (
    <RouterProvider navigate={router.push}>
      <QuestionsContext.Provider value={value}>
        <TypeDefsContext.Provider value={typeDef}>
          {children}
        </TypeDefsContext.Provider>
      </QuestionsContext.Provider>
    </RouterProvider>
  );
};
