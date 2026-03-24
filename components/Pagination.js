import React from "react";
import { ChevronLeft, ChevronRight } from "@geist-ui/icons";

const Pagination = ({ currentPage, totalPages, onPageChange, className }) => {
  const isLastPage = currentPage === totalPages || totalPages === 0;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = Math.max(1, totalPages);

    for (let i = 1; i <= maxVisible; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => totalPages > 1 && onPageChange(i)}
          className={`w-9 h-9 flex items-center justify-center rounded-[4px] text-[0.875rem] font-medium transition-all ${
            currentPage === i
              ? "bg-[#EA2B2E] text-white shadow-lg shadow-[#EA2B2E]/20"
              : "text-[#8C8C8C] hover:text-white hover:bg-[#2A2A2A]"
          }`}
        >
          {i}
        </button>
      );
    }

    // Add grayed out ellipsis if on last page or only 1 page
    if (isLastPage) {
      pages.push(
        <div
          key="ellipsis"
          className="w-9 h-9 flex items-center justify-center text-[#4A4A4A] text-[1.25rem] font-bold cursor-default select-none pb-2"
        >
          ...
        </div>
      );
    }

    return pages;
  };

  return (
    <div className={`flex items-center mt-12 gap-3 pb-8 ${className || "justify-center"}`}>
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-2 rounded-[4px] bg-[#1A1A1A] border border-[#2F2F2F] text-[#EFEFEF] hover:bg-[#252525] disabled:opacity-30 disabled:cursor-not-allowed transition-colors group"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex items-center gap-1.5">
        {renderPageNumbers()}
      </div>

      <button
        onClick={() => !isLastPage && onPageChange(currentPage + 1)}
        disabled={isLastPage}
        className="p-2 rounded-[4px] bg-[#1A1A1A] border border-[#2F2F2F] text-[#EFEFEF] hover:bg-[#252525] disabled:opacity-30 disabled:cursor-not-allowed transition-colors group"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
