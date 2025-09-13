import { useState } from "react";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface ProfileMenuProps {
  userName?: string;
  userImage?: string;
  onLogout: () => void;
}

const ProfileMenu = ({ userName, userImage, onLogout }: ProfileMenuProps) => {
  const [open, setOpen] = useState(false);

  
  const getInitials = (name?: string) => {
    if (!name) return "MP"; 
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 focus:outline-none">
          {userImage ? (
            <img
              src={userImage}
              alt="User"
              className="h-9 w-9 rounded-full object-cover border"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              {getInitials(userName)}
            </div>
          )}
          <span className="font-medium">{userName || "My Profile"}</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-52 mt-2">
        <DropdownMenuLabel className="font-semibold">
          Signed in as <br />
         
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => (window.location.href = "/profile")}
          className="cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" /> View Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer text-red-600 focus:text-red-700"
        >
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
