const navItems = ["Home", "Career", "Graph", "Jobs", "Docs", "AI"];

export default function D2NavigationFrame() {
  return (
    <aside className="w-24 shrink-0 border-r border-slate-200 bg-white p-3">
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <button
            key={item}
            className="rounded-xl px-2 py-3 text-xs font-medium text-slate-500 hover:bg-blue-50 hover:text-blue-600"
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}