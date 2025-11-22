import React, { useEffect, useState } from "react";
import axios from "axios";
import '../styles/CategoryChart.css';
import { useContext } from 'react';
import { LmsContext } from '../context/LmsContext';

const CategoryRange = () => {
  const [data, setData] = useState({});
  const {token}=useContext(LmsContext)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8081/lms/book/getBookTypeAndCount",
          { headers: { Authorization:  `Bearer ${token}` } }
        );
        setData(res.data);
        console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const totalBooks = Object.values(data).reduce((acc, val) => acc + val, 0);

  const colors = [
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // orange
    "#ef4444", // red
    "#6b7280", // gray
  ];

  return (
    <div className="category-card">
      <h3 className="category-title">Category Distribution</h3>
      {Object.entries(data).map(([category, count], index) => {
        const percentage = totalBooks ? ((count / totalBooks) * 100).toFixed(0) : 0;
        return (
          <div key={category} className="category-item">
            <span className="category-name">{category}</span>
            <span className="category-percentage">{percentage}%</span>
            <div className="category-bar">
              <div
                className="category-bar-fill"
                style={{ width: `${percentage}%`, backgroundColor: colors[index % colors.length] }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryRange;