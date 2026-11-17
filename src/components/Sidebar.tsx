import NewFolderButton from "./Newfolder";

export interface Folder {
  id: string | number;
  title: string;
}

interface SideBarProps {
  folders: Folder[];
  onFolderSelect: (folder: Folder) => void;
  onCreateFolder: (name: string) => void | Promise<void>;
}

export default function Sidebar({
  folders,
  onFolderSelect,
  onCreateFolder
}: SideBarProps) {
  return (
    <aside className="sticky top-0 h-screen w-64 shrink-0 bg-gray-900 text-white p-5">
      <h1 className="text-5xl font-bold mb-10">Atlas</h1>

      <NewFolderButton onCreate={onCreateFolder} />

      <div>
        {folders.map((folder) => (
          <div key={folder.id} className="flex items-center justify-between py-5">
            <button
              type="button"
              className="flex-1 text-left"
              onClick={() => onFolderSelect(folder)}
            >
              {folder.title}
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
