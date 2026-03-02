import { School } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";

type Props = {
  school: Pick<School, "id" | "name" | "type" | "location"> & Partial<School>;
};

export function SchoolCard({ school }: Props) {
  const [detail, setDetail] = useState<Partial<School>>({});

  useEffect(() => {
    let ignore = false;
    if (!school.studentCount || !school.history || !school.description) {
      fetch(`${API_BASE_URL}/api/schools/${school.id}`)
        .then((res) => res.ok ? res.json() : null)
        .then((data) => {
          if (data && !ignore) setDetail(data);
        });
    }
    return () => { ignore = true; };
  }, [school.id, school.studentCount, school.history, school.description]);

  const studentCount = school.studentCount || detail.studentCount || "-";
  const history = school.history || detail.history || "";
  const description = school.description || detail.description || "";

  return (
    <Link href={`/schools/${school.id}`} className="block group">
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-md p-6 hover:shadow-xl transition-all h-full" style={{ borderColor: 'rgba(87,102,168,0.12)' }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold bg-[color:var(--brand-light)]/20 px-2 py-0.5 rounded-full" style={{ color: 'var(--brand)', backgroundColor: 'rgba(158,167,230,0.12)' }}>
            {school.type}
          </span>
          <span className="text-xs text-gray-400 dark:text-neutral-400">{school.location}</span>
        </div>
        <h3 className="font-extrabold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors leading-snug">
          {school.name}
        </h3>
        <div className="mt-4 text-sm text-gray-500 dark:text-neutral-300 bg-gray-50 dark:bg-neutral-800 rounded-lg px-4 py-3">
          <div className="mb-1">학생수: <span className="font-semibold text-blue-700 dark:text-cyan-400">{studentCount}</span></div>
          <div className="mb-1">역사: <span className="font-semibold text-blue-700 dark:text-cyan-400">{history}</span></div>
          <div className="line-clamp-2">{description}</div>
        </div>
        <div className="flex justify-end mt-3">
          <span className="text-xs flex items-center gap-1 font-semibold" style={{ color: 'var(--brand-light)' }}>
            자세히 보기 <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}