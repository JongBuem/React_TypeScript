import React from "react";
import { styled } from "@mui/material/styles";
import { Pagination, PaginationItem } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export const PaginationCustom = styled(Pagination)(() => ({
  "&.MuiPagination-root .MuiPagination-ul": {
    paddingTop: "15px",
    border: "none",
  },
  "&.MuiPagination-root .MuiPagination-ul li": {
    // borderTop: '1px solid #eaeaea',
    // borderLeft: '1px solid #eaeaea',
    // borderBottom: '1px solid #eaeaea',
    // width: '40px',
    // height: '40px',
    border: "none",
  },
  "&.MuiPagination-root .MuiPagination-ul .MuiButtonBase-root": {
    padding: 10,
    color: "#172b4d",
    margin: 0,
    border: "none",
    fontSize: "15px",
    width: "36px",
    height: "36px",
    borderRadius: "10px",
  },
  "&.MuiPagination-root .MuiPagination-ul .MuiButtonBase-root.Mui-selected": {
    background: "#eee",
    color: "#642977",
    fontWeight: "bold",
    borderRadius: "10px",
    padding: 0,
    margin: 0,
  },
}));

export const usePagination = (data: any[], itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const maxPage = Math.ceil(data.length / itemsPerPage);

  function currentData() {
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    return data.slice(begin, end);
  }

  function next() {
    setCurrentPage((currentPage) => Math.min(currentPage + 1, maxPage));
  }

  function prev() {
    setCurrentPage((currentPage) => Math.max(currentPage - 1, 1));
  }

  function jump(page: number) {
    const pageNumber = Math.max(1, page);
    setCurrentPage((currentPage) => Math.min(pageNumber, maxPage));
  }

  return { next, prev, jump, currentData, currentPage, maxPage };
};

export interface PagingIF {
  page: number;
  count: number;
  handleChange: (e: React.ChangeEvent<unknown>, p: number) => void;
}

export default function Paging({ page, count, handleChange }: PagingIF) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <PaginationCustom
        shape="rounded"
        page={page}
        count={count}
        renderItem={(props2) => (
          <PaginationItem
            slots={{
              previous: ArrowBackIcon,
              next: ArrowForwardIcon,
            }}
            {...props2}
          />
        )}
        onChange={(e, p) => handleChange(e, p)}
      />
    </div>
  );
}
