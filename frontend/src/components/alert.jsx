import { useState } from "react";

export default function Alert({ message, description, onClose, type = "success" }) {
  // choose styles dynamically based on type
  const isError = type === "error";

  const iconColor = isError ? "text-red-600" : "text-green-600";
  const borderColor = isError ? "border-red-300" : "border-green-300";
  const bgColor = isError ? "bg-red-50" : "bg-green-50";
  const textColor = isError ? "text-red-800" : "text-green-800";

  return (
    <div
      role="alert"
      className={`rounded-md border ${borderColor} ${bgColor} p-4 shadow-sm`}
    >
      <div className="flex items-start gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className={`size-6 ${iconColor}`}
        >
          {isError ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m0 3.75h.007v.008H12v-.008zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          )}
        </svg>

        <div className="flex-1">
          <strong className={`font-medium ${textColor}`}>{message}</strong>
          <p className={`mt-0.5 text-sm ${textColor}`}>{description}</p>
        </div>

        <button
          className="-m-3 rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          type="button"
          aria-label="Dismiss alert"
          onClick={onClose}
        >
          <span className="sr-only">Dismiss popup</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
