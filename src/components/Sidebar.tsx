import NewFolderButton from "./Newfolder";
import type { AuthUser } from "../Atlas";
import { useState } from "react";
import {type Folder } from "../Atlas";
import FileTree from "./smoothui/FileTreeCn";
import type { FileTreeItem } from "./smoothui/FileTreeCn";

interface SideBarProps {
	user: AuthUser
	folders: Folder[];
	selectedFolder: Folder | null;
	onFolderSelect: (folder: Folder | null) => void;
	onCreateFolder: (name: string) => void | Promise<void>;
}

export default function Sidebar({
	user,
	folders,
	selectedFolder,
	onFolderSelect,
	onCreateFolder
}: SideBarProps) {

	const [isLoggingOut, setIsLoggingOut] = useState(false);
  	const [logoutError, setLogoutError] = useState<string | null>(null);

	async function handleLogout() {
		setIsLoggingOut(true);
		setLogoutError(null);
		try {
		const response = await fetch("/api/auth/logout.php", {
			method: "POST",
			credentials: "include",
		});
		if (!response.ok) {
			throw new Error("Logout request failed");
		}
		window.location.assign("/login");
		} catch {
		setIsLoggingOut(false);
		setLogoutError("Impossible de fermer la session. Réessayez.");
		}
	}

	const items: FileTreeItem[] = folders.map((folder) => ({
		id: String(folder.id),
		name: folder.title,
		type: "folder",
		children: [],
		folder,
	}));
	
	// const items: FileTreeItem[] = [
	// {
	// 	children: [
	// 	{
	// 		children: [
	// 		{ id: "button", name: "button.tsx", type: "file" },
	// 		{ id: "card", name: "card.tsx", type: "file" },
	// 		],
	// 		id: "components",
	// 		name: "components",
	// 		type: "folder",
	// 	},
	// 	{ id: "layout", name: "layout.tsx", type: "file" },
	// 	{ id: "page", name: "page.tsx", type: "file" },
	// 	],
	// 	id: "app",
	// 	name: "app",
	// 	type: "folder",
	// },
	// {
	// 	children: [
	// 	{ id: "utils", name: "utils.ts", type: "file" },
	// 	{ id: "hooks", name: "use-toggle.ts", type: "file" },
	// 	],
	// 	id: "lib",
	// 	name: "lib",
	// 	type: "folder",
	// },
	// { badge: "new", id: "readme", name: "README.md", type: "file" },
	// { id: "package", name: "package.json", type: "file" },
	// ];

	return (
		<aside className="sticky top-0 flex h-screen w-64  flex-col bg-[#0E0E0D] p-5 text-[#B7B7B0]">
			<button
				type="button"
				className="text-6xl mb-10 font-bebas"
				onClick={() => onFolderSelect(null)}
				>
				Atlas
			</button>


			<div>
				<NewFolderButton onCreate={onCreateFolder} />
{/* 
				{folders.map((folder) => (
				<div key={folder.id} className={`flex items-center justify-between p-2 my-2  ${
				selectedFolder?.id === folder.id
					? "bg-[#292925] text-white"
					: "hover:bg-[#1A1A18]"}`
				}>
					<button
					type="button"
					className="flex-1 text-left"
					onClick={() => onFolderSelect(folder)}
					>
					{folder.title}
					</button>
				</div>
				))} */}
			</div>

			<FileTree
				items={items}
				selectedFolder={selectedFolder}
				onFolderSelect={onFolderSelect}
				showLines
			/>

			<div className="flex mt-auto items-center gap-4">
				<span className="hidden text-sm sm:inline">
					{user.name}
				</span>
				<button
				type="button"
				onClick={handleLogout}
				disabled={isLoggingOut}
				className="rounded-lg border px-3 py-2 text-sm font-medium  hover:bg-gray-50 hover:text-[#0E0E0D] disabled:cursor-not-allowed disabled:opacity-60"
				>
				{isLoggingOut ? "…" : "Logout"}
				</button>
				{logoutError && (
				<span role="alert" className="text-xs text-red-600">
					{logoutError}
				</span>
				)}
			</div>
		</aside>
	);
}
