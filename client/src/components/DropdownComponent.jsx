import { useState, useEffect } from 'react';

const DropdownComponent = ({ formData, handleChange, errors }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/src/cities/cities.json')
      .then(response => response.json())
      .then(jsonData => {
        const sortedData = jsonData.sort((a, b) => a.name.localeCompare(b.name));
        setData(sortedData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <select
        name="location"
        id="dropdown"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={formData.location}
        onChange={handleChange}
      >
        <option value="">Select City</option>
        {data.map((item) => (
          <option key={item.id} value={item.name}>{item.name}</option>
        ))}
      </select>
      {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
    </div>
  );
};

export default DropdownComponent;
