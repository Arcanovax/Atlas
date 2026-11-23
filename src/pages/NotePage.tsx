import {type Folder, Note } from "../Atlas";
import { useState } from "react";

interface NotePageProps {
	selectedNote?: Note;
	selectedFolder?: Folder;
	onCreateNote?: (title: string, content: string, parentId: string | number) => void | Promise<void>;
}


export default function NotePage({
	selectedNote,
	selectedFolder,
	onCreateNote
}: NotePageProps) {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	if (selectedFolder && onCreateNote) {
		return (
			<section className="mx-auto w-full px-4 md:px-10">
				<div className="mb-5">
					<p className="mb-2 text-sm text-[#62625E]">{selectedFolder.title}</p>
					<h1 className="font-bebas text-6xl leading-none text-[#EEEDE7] md:text-7xl">
						New note
					</h1>
				</div>
				<div className="space-y-5">
					<input
						className="w-full border-0 border-b border-[#282825] bg-transparent px-0 py-4 text-3xl font-medium text-[#EEEDE7] outline-none placeholder:text-[#62625E] focus:border-[#62625E]"
						placeholder="Title"
						value={title}
						onChange={(event) => setTitle(event.target.value)}
					/>
					<textarea
						className="min-h-72 w-full resize-y border-0 border-b border-[#282825] bg-transparent px-0 py-4 text-lg leading-7 text-[#B7B7B0] outline-none placeholder:text-[#62625E] focus:border-[#62625E]"
						placeholder="Write your note..."
						value={content}
						onChange={(event) => setContent(event.target.value)}
					/>
					<div className="flex justify-end">
						<button
							className="rounded-lg border border-[#282825] px-4 py-2 text-sm font-medium text-[#EEEDE7] transition-colors hover:bg-[#282825] disabled:cursor-not-allowed disabled:opacity-50"
							type="button"
							disabled={!title.trim()}
							onClick={() => {
								if (title.trim()) {
									void onCreateNote(title.trim(), content, selectedFolder.id);
								}
							}}
						>
							Save the note
						</button>
					</div>
				</div>
			</section>
		);
	}

	if (!selectedNote) {
		return null;
	}

	return (
		<article className="mx-auto w-full px-4 md:px-10">
			<header className="mb-8 border-b border-[#282825] pb-5">
				<p className="mb-2 text-sm text-[#62625E]">
					{selectedNote.created_at}
				</p>
				{selectedFolder && (
					<p className="text-sm text-[#62625E]">{selectedFolder.title}</p>
				)}
				<h1 className="font-bebas text-6xl leading-none text-[#EEEDE7] md:text-7xl">
					{selectedNote.title}
				</h1>
			</header>
			<p className="whitespace-pre-wrap text-lg leading-8 text-[#B7B7B0]">
				{selectedNote.content || "This note is empty."}
			</p>
		</article>
	);
}
