import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { SignedIn, UserButton, useUser } from "@clerk/clerk-react";

export function NavUser() {
  const { user } = useUser();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <span className="w-full flex flex-row justify-between items-center gap-3">
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "size-8 md:size-10",
                  avatarImage: "size-8 md:size-10",
                  avatarFallback: "size-8 md:size-10",
                },
              }}
            />
          </SignedIn>
          <span className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user?.username}</span>
            <span className="truncate text-xs">
              {user?.emailAddresses[0].emailAddress}
            </span>
          </span>
        </span>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
