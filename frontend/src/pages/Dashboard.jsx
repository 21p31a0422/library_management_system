import React, { useState, useEffect, useContext } from 'react';
import { FaBook, FaUsers, FaExclamationTriangle, FaBookOpen } from 'react-icons/fa';
import ManagerNavbar from "../components/ManagerNavbar";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Dashboard.css';
import CategoryChart from "../components/CategoryChart"
import { useNavigate } from 'react-router-dom';
import { LmsContext } from '../context/LmsContext';

const StatCard = ({ icon, title, value, iconBg }) => (
  <div className="stat-card shadow-sm border-0 rounded-3 overflow-hidden">
    <div className="stat-card-body p-4">
      <div className="stat-card-content d-flex align-items-center">
        <div className={`icon-wrapper rounded-3 p-3 me-3 bg-${iconBg} text-white`}>
          {icon}
        </div>
        <div className="ms-2">
          <p className="text-muted mb-0">{title}</p>
          <h1 className="mb-0 fw-bold">{value}</h1>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {


  const [stats, setStats] = useState({

    totalBooks: 0,
    totalMembers: 0,
    overdueBooks: 0,
    availableBooks: 0,
    totalCheckedOut: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { token, id } = useContext(LmsContext)
  useEffect(() => {
    const fetchDashboardData = async () => {
      console.log(id);
      try {
        setLoading(true);
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
        const baseUrl = 'http://localhost:8081/lms';

        let totalBooks = 0;
        let totalMembers = 0;
        let overdueBooks = 0;
        let availableBooks = 0;
        let totalCheckedOut = 0;

        // Total books
        try {
          const booksResponse = await axios.get(`${baseUrl}/bookissue/getTotalBooksCount`, { headers });
          totalBooks = booksResponse.data || 0;
        } catch (error) {
          totalBooks = 0;
        }

        // Total members
        try {
          const membersResponse = await axios.get(`${baseUrl}/borrower/fetchBorrowers`, { headers });
          if (membersResponse.data) {
            totalMembers = Array.isArray(membersResponse.data)
              ? membersResponse.data.filter(member => member.deleted === false).length
              : 0;

          }
        } catch (error) {
          totalMembers = 0;
        }

        // Overdue books
        try {
          const overdueResponse = await axios.get(`${baseUrl}/bookissue/getOverdueBooksCount`, { headers });
          overdueBooks = overdueResponse.data || 0;
        } catch (error) {
          overdueBooks = 0;
        }

        // Available books
        try {
          const availableResponse = await axios.get(`${baseUrl}/bookissue/getActiveBorrowersCount`, { headers });
          availableBooks = availableResponse.data || 0;
        } catch (error) {
          availableBooks = 0;
        }

        // Checked out books
        try {
          const checkedOutResponse = await axios.get(`${baseUrl}/bookissue/getCheckedOutBooksCount`, { headers });
          totalCheckedOut = checkedOutResponse.data || 0;
        } catch (error) {
          totalCheckedOut = 0;
        }

        // Update state
        setStats({
          totalBooks,
          totalMembers,
          overdueBooks,
          availableBooks,
          totalCheckedOut,
        });

        setError(null);
      } catch (err) {
        console.error('Error in dashboard function:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);




  return (
    <div className='dashboard-page'>
      <ManagerNavbar />
      <div className="container-fluid dashboard-container ">

        <h1 className="fw-bold heading">Dashboard</h1>


        <div className="row stat-row g-4 mb-4">
          <div className="stat-col col-12 col-lg-12 col-md-12 col-xl-12">
            <div className="stat-card total-books shadow-sm border-0 rounded-3 overflow-hidden">
              <StatCard
                icon={<FaBook size={24} />}
                title="Total Books"
                value={stats.totalBooks.toLocaleString()}
                iconBg="primary"
              />
            </div>

            <div className="stat-card total-borrowers shadow-sm border-0 rounded-3 overflow-hidden">
              <StatCard
                icon={<FaUsers size={24} />}
                title="Total Borrowers"
                value={stats.totalMembers.toLocaleString()}
                iconBg="success"
              />
            </div>

            <div className="stat-card overdue-books shadow-sm border-0 rounded-3 overflow-hidden">
              <StatCard
                icon={<FaExclamationTriangle size={24} />}
                title="Overdue Books"
                value={stats.overdueBooks}
                iconBg="danger"
              />
            </div>
          </div>
        </div>
        <div className="row stat-row g-4 mb-4">
          <div className="stat-col col-12 col-lg-12 col-xl-12 col-md-12" >
            <div className="stat-card active-borrowers shadow-sm border-0 rounded-3 overflow-hidden">
              <StatCard
                icon={<FaBookOpen size={24} />}
                title="Active Borrowers"
                value={stats.availableBooks.toLocaleString()}
                iconBg="warning"
              />
            </div>



            <div className="stat-card checked-out-books shadow-sm border-0 rounded-3 overflow-hidden">
              <StatCard
                icon={<FaBookOpen size={24} />}
                title="Checked Out Books"
                value={stats.totalCheckedOut.toLocaleString()}
                iconBg="info"
              />
            </div>
          </div>
        </div>

        <div className="category-chart ">
          <CategoryChart />
        </div>
      </div>
    </div>

  );
};

export default Dashboard;