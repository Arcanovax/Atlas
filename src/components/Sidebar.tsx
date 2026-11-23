import NewFolderButton from "./Newfolder";
import type { AuthUser, Selection } from "../Atlas";
import { useState } from "react";
import {type Folder, Note } from "../Atlas";
import FileTree from "./smoothui/FileTreeCn";
import type { FileTreeItem } from "./smoothui/FileTreeCn";

interface SideBarProps {
	user: AuthUser
	folders: Folder[];
	notes: Note[];
	selection: Selection;
	onSelectionChange: (selection: Selection) => void;
	onCreateFolder: (name: string) => void | Promise<void>;
	onRenameFolder: (id: string | number, title: string) => void | Promise<void>;
	onRenameNote: (id: string | number, title: string) => void | Promise<void>;
	onDeleteFolder: (id: string | number) => void | Promise<void>;
	onDeleteNote: (id: string | number) => void | Promise<void>;
}

export default function Sidebar({
	user,
	folders,
	notes,
	selection,
	onSelectionChange,
	onCreateFolder,
	onRenameFolder,
	onRenameNote,
	onDeleteFolder,
	onDeleteNote
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
		id: `folder:${String(folder.id)}`,
		name: folder.title,
		type: "folder",
		children: [],
	}));

	const foldersMap = new Map(
		folders.map((folder, index) => [String(folder.id), items[index]])
	);

	notes.forEach((note) => {
		const parent = foldersMap.get(String(note.parent_id));

		if (parent) {
			parent.children.push({
				id: `note:${String(note.id)}`,
				name: note.title,
				type: "file"
			});
		}
	});

	const handleSelectedChange = (id: string) => {
		if (id.startsWith("folder:")) {
			const folder = folders.find(
				(item) => `folder:${String(item.id)}` === id
			);
			onSelectionChange(folder ? { kind: "folder", folder } : null);
			return;
		}

		if (id.startsWith("note:")) {
			const note = notes.find(
				(item) => `note:${String(item.id)}` === id
			);
			const folder = folders.find(
				(item) => String(item.id) === String(note?.parent_id)
			);
			onSelectionChange(note && folder ? { kind: "note", folder, note } : null);
		}
	};

	const handleItemAction = (id: string) => {
		if (id.startsWith("folder:")) {
			const folder = folders.find(
				(item) => `folder:${String(item.id)}` === id
			);
			if (!folder) return;
			void onDeleteFolder(folder.id);
			return;
		}

		if (id.startsWith("note:")) {
			const note = notes.find(
				(item) => `note:${String(item.id)}` === id
			);
			if (!note) return;
			void onDeleteNote(note.id);
		}
	};

	const handleItemRename = (id: string, title: string) => {
		if (id.startsWith("folder:")) {
			const folder = folders.find(
				(item) => `folder:${String(item.id)}` === id
			);
			if (folder) void onRenameFolder(folder.id, title);
			return;
		}

		if (id.startsWith("note:")) {
			const note = notes.find(
				(item) => `note:${String(item.id)}` === id
			);
			if (note) void onRenameNote(note.id, title);
		}
	};

	const selectedId = selection?.kind === "note"
		? `note:${String(selection.note.id)}`
		: selection?.kind === "folder"
			? `folder:${String(selection.folder.id)}`
			: null;

	return (
		<aside className="sticky top-0 flex h-screen w-64  flex-col bg-[#0E0E0D] p-5 text-[#B7B7B0]">
			<button
				type="button"
				className="text-6xl mb-10 font-bebas"
				onClick={() => onSelectionChange(null)}
				>
				Atlas
			</button>


			<div>
				<NewFolderButton onCreate={onCreateFolder} />
			</div>

			<FileTree
				items={items}
				selected={selectedId}
				onSelectedChange={handleSelectedChange}
				onItemAction={handleItemAction}
				onItemRename={handleItemRename}
				className=""
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
