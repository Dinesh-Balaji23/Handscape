import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import './CSS/SellerDashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const SellerDashboard = () => {
  const { sellername } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/orders/seller-analytics/${sellername}`);
        setAnalytics(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [sellername]);

  const barChartData = {
    labels: ['Total Products Sold', 'Total Orders'],
    datasets: [
      {
        label: 'Count',
        data: [
          analytics?.totalProductsSold || 0,
          analytics?.totalOrders || 0
        ],
        backgroundColor: ['#36A2EB', '#FFCE56'],
        borderColor: ['#36A2EB', '#FFCE56'],
        borderWidth: 1
      }
    ]
  };

  const statusDistributionData = {
    labels: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
    datasets: [
      {
        data: analytics ? [
          analytics.statusDistribution.Pending,
          analytics.statusDistribution.Shipped,
          analytics.statusDistribution.Delivered,
          analytics.statusDistribution.Cancelled
        ] : [0, 0, 0, 0],
        backgroundColor: [
          'rgba(255, 206, 86, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 99, 132, 0.5)'
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="seller-dashboard-container">
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: 'black' }}>
        <div className="container-fluid">
          <a className="navbar-brand" href={`/seller-dashboard/${sellername}`} style={{ color: 'orange', fontWeight: 'bold' }}>
            Handscape (Seller)
          </a>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link to={`/seller-dashboard/${sellername}`} className="nav-link active">Home</Link></li>
            <li className="nav-item"><Link to={`/addproduct/${sellername}`} className="nav-link">Add Product</Link></li>
            <li className="nav-item"><Link to={`/seller-orders/${sellername}`} className="nav-link">Orders</Link></li>
            <li className="nav-item"><Link to="/login" className="nav-link">Logout ({sellername})</Link></li>
          </ul>
        </div>
      </nav>

      <div className="dashboard-content">
        <h2>Welcome, {sellername}</h2>
        <h4>Here are your analytics:</h4><br />
        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total Products</h3>
            <p>{analytics?.totalProducts || 0}</p>
          </div>
          <div className="summary-card">
            <h3>Total Orders</h3>
            <p>{analytics?.totalOrders || 0}</p>
          </div>
        </div>

        <div className="charts-container">
          <div className="chart-card">
            <h3>Overall Sales Overview</h3>
            <div className="chart-wrapper">
              <Bar
                data={barChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    title: {
                      display: true,
                      text: 'Sales vs Orders'
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="chart-card">
            <h3>Order Status Distribution</h3>
            <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Pie
                data={statusDistributionData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: { position: 'bottom' },
                    title: {
                      display: true,
                      text: 'Order Status Breakdown'
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
