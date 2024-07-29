import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";

const categoryTranslations = {
  Ring: "Nhẫn",
  Earrings: "Bông tai",
  Necklace: "Dây chuyền",
  Bracelet: "Vòng tay",
};

function SearchPage() {
  const { query } = useParams();
  const [filteredDesigns, setFilteredDesigns] = useState([]);
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleNavigate = (designID) => {
    navigate(`/product-details/${designID}`);
  };

  const handleSearchSelect = async () => {
    try {
      const categoryQuery = selectedCategories.join(",");
      const response = await axiosInstance.get(
        `design/getAllCompanyDesign?designName=${query}&category=${categoryQuery}`
      );
      setFilteredDesigns(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prevCategories) => {
      const newCategories = new Set(prevCategories);
      newCategories.has(category)
        ? newCategories.delete(category)
        : newCategories.add(category);
      return [...newCategories];
    });
  };

  useEffect(() => {
    handleSearchSelect();
  }, [query, selectedCategories]);

  return (
    <div className="min-h-screen w-full bg-[#434343] text-[#F7EF8A] p-4">
      <h1 className="text-center text-2xl md:text-4xl py-4">
        KẾT QUẢ TÌM KIẾM CHO "{query}"
      </h1>
      <div className="flex ">
        <div className="w-1/4 p-4">
          <h2 className="text-xl mb-4">Filter by Category:</h2>
          {Object.keys(categoryTranslations).map((category) => (
            <div key={category} className="mb-2">
              <input
                type="checkbox"
                id={category}
                value={category}
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="mr-2"
              />
              <label htmlFor={category} className="text-lg">
                {categoryTranslations[category]}
              </label>
            </div>
          ))}
        </div>
        <div className="w-3/4 p-4">
          {filteredDesigns.length > 0 ? (
            <div className="container mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredDesigns.map((item) => (
                  <div
                    className="bg-black p-4 rounded-lg text-white"
                    key={item.id}
                  >
                    <img
                      src={item.listURLImage[0]}
                      alt={item.designName}
                      className="w-full h-48 object-cover rounded-lg bg-white"
                    />
                    <div className="mt-2">
                      <div className="text-[#F7EF8A] text-xl md:text-2xl">
                        {item.designName}
                      </div>
                      <div className="text-lg md:text-xl">
                        {item.description}
                      </div>
                      <div className="text-md md:text-lg">{item.category}</div>
                      <button
                        className="mt-4 text-black text-lg md:text-xl rounded-lg font-bold w-full p-2 bg-[#F7EF8A] hover:bg-gradient-to-br hover:from-white hover:to-[#fcec5f]"
                        onClick={() => handleNavigate(item.id)}
                      >
                        XEM CHI TIẾT
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-xl md:text-2xl">
              KHÔNG TÌM THẤY SẢN PHẨM PHÙ HỢP
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
