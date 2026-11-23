import {type Folder, Note, Selection } from "../Atlas";

interface FolderPageProps {
	selectedFolder: Folder;
	notes: Note[];
	onSelectionChange: (selection: Selection) => void;
	onAddNote: () => void;
}


export default function FolderPage({
	selectedFolder,
	notes,
	onSelectionChange,
	onAddNote
}: FolderPageProps) {
	const folderNotes = notes.filter(
		(note) => Number(note.parent_id) === Number(selectedFolder.id)
	);

	return (
		<section className="mx-auto w-full px-10">
			<div className="mb-5 flex items-end ">
				<div className="min-w-0">
					<p className="mb-2 text-sm text-[#62625E]">
						{folderNotes.length} {folderNotes.length === 1 ? "note" : "notes"}
					</p>
					<h1 className="truncate font-bebas text-6xl leading-none text-[#EEEDE7] md:text-7xl">
						{selectedFolder.title}
					</h1>
				</div>
				<button className="m-4 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50 hover:text-[#0E0E0D] disabled:cursor-not-allowed disabled:opacity-60"
					onClick={onAddNote}>
					Add a note
				</button>
			</div>

			{folderNotes.length > 0 ? (
				<div className="divide-y divide-[#282825] border-t border-[#282825]">
					{folderNotes.map((note) => (
						<button
							type="button"
							className="group flex w-full items-center justify-between gap-6 px-4 py-4 text-left transition-colors hover:bg-[#282825]/70"
							key={note.id}
							onClick={() => {
								onSelectionChange({
									kind: "note",
									folder: selectedFolder,
									note,
								});
							}}
						>
							<div className="min-w-0">
								<h3 className="truncate text-xl font-medium text-[#EEEDE7]">
									{note.title}
								</h3>
								{note.content && (
									<p className="mt-1 truncate text-sm text-[#62625E]">
										{note.content.replace(/\s+/g, " ").trim()}
									</p>
								)}
							</div>
							<svg
								className="h-5 w-5 shrink-0 text-[#62625E] transition-transform group-hover:translate-x-1 group-hover:text-[#B7B7B0]"
								viewBox="0 0 20 20"
								fill="none"
								aria-hidden="true"
							>
								<path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1.5" />
							</svg>
						</button>
					))}
				</div>
			) : (
				<div className="flex min-h-48 items-center justify-center border-t border-[#282825] text-center">
					<p className="text-sm text-[#62625E]">No notes</p>
				</div>
			)}
		</section>
	);
}
