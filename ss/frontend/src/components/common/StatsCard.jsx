export default function StatsCard({
  title,
  value,
  icon: Icon,
  color = "violet",
  index = 0,
}) {
  const colors = {
    violet:
      "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300",
    blue: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300",
    green:
      "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-300",
    orange:
      "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300",
    pink: "bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300",
  };
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
