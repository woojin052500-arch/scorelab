import { School } from "@/types";
import Link from "next/link";

type Props = {
  school: School;
};

export function SchoolCard({ school }: Props) {
  return (
    <Link href={`/schools/${school.id}`} className="block group">
      <div className="border border-gray-200 rounded-xl p-5 bg-white hover:border-indigo-300 hover:shadow-sm transition-all h-full">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
            {school.type}
          </span>
          <span className="text-xs text-gray-400">{school.location}</span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-700 transition-colors leading-snug">
          {school.name}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{school.description}</p>
        <div className="flex gap-3 text-xs text-gray-400">
          <span>학생 수: {school.studentCount}</span>
          <span>{school.history}</span>
        </div>
      </div>
    </Link>
  );
}