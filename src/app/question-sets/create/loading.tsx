import { SkeletonPageHeader } from "../../../components/page-header";
import { Skeleton } from "../../../components/skeleton";

export default function Loading() {
  return (
    <>
      <div className="w-[300px]">
        <SkeletonPageHeader />
      </div>
      <Skeleton />
    </>
  );
}
