import { lazy, Suspense, type ComponentProps } from "react";
import type { Avatar as AvatarType } from "./Avatar";

// three.js + drei are most of the bundle; keep them off the critical path.
const AvatarImpl = lazy(() => import("./Avatar").then((m) => ({ default: m.Avatar })));

export function LazyAvatar(props: ComponentProps<typeof AvatarType>) {
  return (
    <Suspense
      fallback={
        <div className={props.className}>
          <div className="absolute inset-0 grid place-items-center">
            <div className="h-24 w-24 animate-pulse rounded-full bg-bg-3" />
          </div>
        </div>
      }
    >
      <AvatarImpl {...props} />
    </Suspense>
  );
}
