
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Settings, 
  LogOut,
  ChevronLeft, 
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const navItems = [
    { 
      icon: LayoutDashboard, 
      label: "Dashboard", 
      href: "/dashboard",
      active: location.pathname === "/dashboard" 
    },
    { 
      icon: Settings, 
      label: "Configurações", 
      href: "/configuration",
      active: location.pathname === "/configuration" 
    },
  ];

  const sidebarVariants = {
    expanded: { width: "240px" },
    collapsed: { width: "72px" }
  };

  if (!user) return null;

  return (
    <motion.div 
      className={cn(
        "sidebar border-r border-border bg-sidebar h-screen fixed top-0 left-0 z-40",
        "flex flex-col overflow-hidden shadow-sm"
      )}
      initial="expanded"
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-bold text-lg text-primary"
          >
            AI Chat Manager
          </motion.div>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="ml-auto"
          onClick={toggleSidebar}
        >
          {isCollapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <div className="flex flex-col flex-grow px-3 py-2 gap-1">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200",
              "hover:bg-sidebar-accent",
              item.active ? "bg-sidebar-accent text-primary" : "text-sidebar-foreground"
            )}
          >
            <item.icon className="w-5 h-5" />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {item.label}
              </motion.span>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-auto border-t border-border p-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-grow min-w-0"
            >
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </motion.div>
          )}
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button
                size="icon"
                variant="ghost"
                onClick={logout}
                className="text-sidebar-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
