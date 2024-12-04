"use client"

import * as React from "react"
import {
  BookOpen,
  Command,
  Home,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMain } from "./NavMain"
import { NavUser } from "./NavUser"
import { NavLink } from "react-router-dom";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: Home
    },
    {
      title: "Orders",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Create Order",
          url: "/create-order",
        }
      ],
    },
    {
      title: "Segmentation",
      url: "#",
      icon: BookOpen,
      isActive: true,
      items: [
        {
          title: "Create Segment",
          url: "/create-segment",
        },
        {
          title: "View All Segments",
          url: "/segments",
        }
      ],
    },
    {
      title: "Campaigns",
      url: "#",
      icon: Settings2,
      isActive: true,
      items: [
        {
          title: "View All Campaign",
          url: "/campaigns",
        }
      ],
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <NavLink to={"/"}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Mini CRM</span>
                  <span className="truncate text-xs">Kritik Chaudhary</span>
                </div>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
