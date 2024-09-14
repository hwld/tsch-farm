import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

type ModuleName = string;
type TypeDefText = string;
type TypeDefs = Map<ModuleName, TypeDefText>;
const TypeDefsContext = createContext<TypeDefs | undefined>(undefined);

export const useTypeDefs = () => {
  const ctx = useContext(TypeDefsContext);
  return ctx;
};

export const TypeDefsProvider: React.FC<PropsWithChildren> = ({ children }) => {
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
    <TypeDefsContext.Provider value={typeDef}>
      {children}
    </TypeDefsContext.Provider>
  );
};
