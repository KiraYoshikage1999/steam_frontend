import React, { useState } from 'react';

export default function CategoryDropdown({ title, items, onSelectItem }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (item) => {
    if (onSelectItem) {
      onSelectItem(item);
    }
    setIsOpen(false);
  };

  return (
    <div className="category-dropdown">
      <button
        type="button"
        className="category-dropdown-btn"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {title} ▾
      </button>
      {isOpen && (
        <div className="category-dropdown-menu">
          {Array.isArray(items) && items.length > 0 ? (
            <div className="category-dropdown-items">
              {items.map((item, index) => (
                <button
                  key={item?.id || item?.Id || index}
                  type="button"
                  className="category-dropdown-item"
                  onClick={() => handleItemClick(item)}
                >
                  {item?.name || item?.Name || item?.title || item?.Title || String(item)}
                </button>
              ))}
            </div>
          ) : (
            <div className="category-dropdown-empty">Нет элементов</div>
          )}
        </div>
      )}
    </div>
  );
}
