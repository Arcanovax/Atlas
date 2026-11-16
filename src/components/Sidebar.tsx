export default function Sidebar() {
  return (
    <aside className="sticky top-0 h-screen w-64 shrink-0
                      bg-gray-900 text-white p-5">

      <h1 className="text-xl font-bold mb-10">
        Atlas
      </h1>

      <nav className="flex flex-col gap-2">
        <a href="#" className="rounded-lg bg-blue-600 p-3">
          Dashboard
        </a>

        <a href="#" className="rounded-lg p-3 hover:bg-gray-800">
          Projects
        </a>

        <a href="#" className="rounded-lg p-3 hover:bg-gray-800">
          Settings
        </a>
      </nav>

    </aside>
  );
}
