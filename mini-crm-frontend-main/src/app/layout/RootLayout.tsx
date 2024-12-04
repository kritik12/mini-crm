import { AppSidebar } from "@/components/shared/layout/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useUser } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";

const defaultChildren = (
  <>
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      <div className="aspect-video rounded-xl bg-muted/50" />
      <div className="aspect-video rounded-xl bg-muted/50" />
      <div className="aspect-video rounded-xl bg-muted/50" />
    </div>
    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
  </>
);

export default function RootLayout({
  children = defaultChildren,
}: {
  readonly children: React.ReactNode;
}) {
  const { pathname } = useLocation();
  const { user, isLoaded } = useUser();

  // Map of paths to breadcrumb labels
  const breadcrumbMap: Record<string, string> = {
    "/home": "Home",
    "/create-order": "Create Order",
    "/create-segment": "Create Segment",
    "/segments": "Segments",
    "/segments/:segmentId": "Segment Details",
    "/campaigns": "Campaigns",
    "/campaigns/:campaignId": "Campaign Details",
  };

  // Generate breadcrumbs dynamically
  const breadcrumbs = pathname
    .split("/") // Split path into segments
    .filter((segment) => segment) // Remove empty segments
    .map((segment, index, arr) => {
      const fullPath = `/${arr.slice(0, index + 1).join("/")}`;
      const label = breadcrumbMap[fullPath] || segment;

      return {
        label,
        href: fullPath,
        isLast: index === arr.length - 1, // Check if it's the last breadcrumb
      };
    });

  if (isLoaded) {
    if (user?.publicMetadata?.role === "admin") {
      // console.log(user);
      children = <h1 className="font-extrabold">Not Authorized</h1>
    }
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs?.map(({ label, href, isLast }, index) => (
                    <BreadcrumbItem key={index}>
                      {isLast ? (
                        <BreadcrumbPage>{label}</BreadcrumbPage>
                      ) : (
                        <>
                          <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                          <BreadcrumbSeparator />
                        </>
                      )}
                    </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
