import { Skeleton } from "@/components/ui/skeleton";

export default function ClientItemSkeleton() {
  return (
    <div className="flex items-center justify-between py-1 px-3 border-[#CCCCCC] border-1 rounded-[8px] shadow-[0px_2px_4px_#0000001A] min-h-[66px]">
      <div className="flex items-center space-x-2 rounded-[8px] py-[5px]">
        <Skeleton className="h-[17px] w-[17px] rounded" />
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <div className="flex gap-3">
            <Skeleton className="h-3 w-[100px]" />
            <Skeleton className="h-3 w-[150px]" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-[60px] rounded-full" />
        <Skeleton className="h-6 w-[110px] rounded-full" />
        <Skeleton className="h-6 w-[80px] rounded-full" />
        <Skeleton className="h-4 w-4 rounded-sm" />
      </div>
    </div>
  );
}
