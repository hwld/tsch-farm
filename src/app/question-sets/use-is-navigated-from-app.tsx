import { isNavigatedfromAppQueryName } from "@/lib/routes";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

/**
 *  ページがアプリ内から遷移されたか
 *
 *  ページのトップレベルで使用することを想定している
 */
export const useIsNavigatedFromApp = () => {
  const [isNavigatedFromApp, setIsNavigatedFromApp] = useState(false);

  const router = useRouter();
  const currentPath = usePathname();
  const searchParams = useSearchParams();

  /**
   * URLの共有によって、意図せずアプリ内からの遷移だと認識されないように、すぐにSearchParamsを削除する
   */
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (newSearchParams.get(isNavigatedfromAppQueryName)) {
      setIsNavigatedFromApp(true);
      newSearchParams.delete(isNavigatedfromAppQueryName);
    }

    router.replace(`${currentPath}?${newSearchParams}`);
  }, [currentPath, router, searchParams]);

  return isNavigatedFromApp;
};
