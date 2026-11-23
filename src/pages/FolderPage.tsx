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
  	return (

	<div className="px-10">
		<div className="flex">
			<h1 className="font-bebas text-7xl">
				{selectedFolder.title}
			</h1>
			<button className="m-4 rounded-lg border px-3 py-2 text-sm font-medium  hover:bg-gray-50 hover:text-[#0E0E0D] disabled:cursor-not-allowed disabled:opacity-60"
			onClick={onAddNote}>
				Add a note
			</button>

		</div>

		<div>

			{notes
				.filter(
				(note) =>
					Number(note.parent_id) === Number(selectedFolder.id)
				)
				.map((note) => (
				<div className="w-full text-2xl mt-3 py-1 pl-3 hover:bg-[#282825] border  border-[#282825]" key={note.id}>
					{/* <button
					className="text-red-600"
					onClick={() => onDeleteNote(note.id)}
					>
					delete
					</button> */}
					<button
					className="w-full text-left"
					onClick={() => {
						if (selectedFolder) {
							onSelectionChange({
								kind: "note",
								folder: selectedFolder,
								note,
							});
						}
					}}
					>
					<h3>{note.title}</h3>
					</button>
				</div>
				))}
			</div>
	</div>

  )}
