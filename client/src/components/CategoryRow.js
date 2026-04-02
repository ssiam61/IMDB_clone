import React from "react";
import MediaCard from "./MediaCard";

const CategoryRow = ({ title, list, type = "media" }) => {
  if (!list || list.length === 0) return null;

  return (
    <div className="mb-4 mt-4">
      <h5 className="mb-2">{title}</h5>

      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "20px",
          paddingBottom: "10px",
          paddingTop: "5px",
          whiteSpace: "nowrap"
        }}
      >
        {list.map((item) => (
          <MediaCard
            key={item.id}
            id={item.id}
            title={item.name}
            image={item.thumbnail || item.profile_image}
            type={type}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryRow;