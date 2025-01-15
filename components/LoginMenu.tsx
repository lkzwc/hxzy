import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export function LoginMenu() {
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);

  if (status === "loading") {
    return <p className="text-gray-500">Loading...</p>;
  }

  return (
    <div className="relative inline-block text-left mr-6">
      {session ? (
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2"
        >
          <img
            src={session.user?.image || "/default-avatar.png"}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="bg-white px-2 py-1 rounded-md text-sm font-medium text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
            {session.user?.name || session.user?.email}
          </span>
          {showDropdown && (
            <div className="absolute mt-40 w-32 origin-top-left bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <div className="py-1">
                <Link href="/profile" passHref>
                  <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </p>
                </Link>
              </div>
              <div className="py-1">
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full text-left block px-4 py-2 text-sm text-red-700 hover:bg-red-100"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link
          href="/login"
          className="ml-8 px-6 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors"
        >
          登录
        </Link>
      )}
    </div>
  );
}