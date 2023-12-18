import React, { useEffect, useState } from "react";
import "./App.css";
const API_ENDPOINT = "https://hacker-news.firebaseio.com/v0";
const ITEMS_PER_PAGE = 6;

function JobPosting({ title, url, by, time }) {
  const formattedTime = new Date(time).toLocaleString();
  return (
    <div className="post" role="list">
      <h2 className="post__title">
        {title}
        <a
          target="_blank"
          rel="noopener"
          className={url ? "" : "inactive__link"}
          href={url}
        >
          {title}
        </a>
      </h2>
      <span className="post__metadata">
        By-{by} -{formattedTime}
      </span>
    </div>
  );
}
const App = () => {
  const [items, setItems] = useState([]);
  const [itemIds, setItemsIds] = useState(null);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchItems = async (currentPage) => {
    setCurrentPage(currentPage);
    setFetchingDetails(true);
   
    try {
      let itemListIds = itemIds;
      if (itemListIds === null) {
        const response = await fetch(`${API_ENDPOINT}/jobstories.json`);
        itemListIds = await response.json();
        setItemsIds(itemListIds);
      }
      const itemsIdsForPage = itemListIds;
      const itemsForPage = await Promise.all(
        itemsIdsForPage.map(async (itemId) =>
          (await fetch(`${API_ENDPOINT}/item/${itemId}.json`)).json()
        )
      );

      const itemsPerPage = itemsForPage.slice(
        currentPage * ITEMS_PER_PAGE,
        ITEMS_PER_PAGE * currentPage + ITEMS_PER_PAGE
      );

      setItems([...items, ...itemsPerPage]);
    } finally {
      setFetchingDetails(false);
    }
  };
  useEffect(() => {
    if (currentPage === 0) fetchItems(currentPage);
  }, []);
console.log(itemIds);
  return (
    <div className="app">
      <h1 className="title">Hacker News Job Board</h1>
      {itemIds === null || items.length < 1 ? (
        <p className="loading">Loading...</p>
      ) : (
        <div>
          <div className="items" role="list">
            {items.map((item) => (
              <JobPosting key={item.id} {...item} />
            ))}
          </div>
          <button
            onClick={() => fetchItems(currentPage + 1)}
            disabled={fetchingDetails || items.length / ITEMS_PER_PAGE === 10}
            id="load__more__btn"
          >
            {fetchingDetails
              ? "Loading"
              : items.length / ITEMS_PER_PAGE === 10
              ? "No more jobs"
              : "Load more jobs"}
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
