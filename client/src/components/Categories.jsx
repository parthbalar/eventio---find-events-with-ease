import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "Music", icon: "🎤" },
  { name: "Circus", icon: "🎠" },
  { name: "Performing & Visual Arts", icon: "🎭" },
  { name: "Comedy", icon: "😂" },
  { name: "Competition", icon: "🎯" },
  { name: "Business", icon: "📊" },
  { name: "Poetry", icon: "📖" },
  { name: "Technology", icon: "💻" },
  { name: "Education", icon: "📚" },
  { name: "Kids", icon: "👶" },
  { name: "Sports & Fitness", icon: "🏃" },
  { name: "Festivals & Celebrations", icon: "🎇" },
  { name: "Tech & Innovation", icon: "🚀" },
];

const Categories = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const handleCategoryClick = (category) => {
    navigate(`/category/${encodeURIComponent(category)}`);

  };

  return (
    <div className="w-full overflow-x-auto no-scrollbar scroll-smooth" ref={scrollRef}>
    <div className="flex gap-6 p-4 w-max">
      {categories.map((category, index) => (
        <div
          key={index}
          onClick={() => handleCategoryClick(category.name)}
          className="flex flex-col items-center justify-center w-[130px] h-[130px] border border-gray-300 rounded-full text-center text-sm transition-all duration-300 hover:bg-gray-100 cursor-pointer"
        >
          <div className="text-4xl">{category.icon}</div>
          <p className="text-gray-700 text-sm text-center mt-2 leading-tight w-[90%] whitespace-pre-wrap">
            {category.name}
          </p>
        </div>
      ))}
    </div>
  </div>
  
  );
};

export default Categories;