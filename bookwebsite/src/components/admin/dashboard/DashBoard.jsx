import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  Dropdown,
  Offcanvas,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiBook,
  FiCheckCircle,
  FiShoppingCart,
  FiMenu,
} from "react-icons/fi";
import { getToken } from "../../../utils/auth";
import { getAllUsers } from "../../../service/userApi";
import { getAllPendingBooks, getBooks } from "../../../service/bookAPI";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [stats, setStats] = useState({
    users: 0,
    sellers: 0,
    books: 0,
    pendingBooks: 0, 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const [usersData, booksData, pendingBooksData] = await Promise.all([
          getAllUsers(token),
          getBooks(),
          getAllPendingBooks(token),
        ]);

        const sellerCount = usersData.filter((u) => u.userRole === "SELLER").length;

        setStats({
          users: usersData.length,
          sellers: sellerCount,
          books: booksData.data?.data.length || 0,
          pendingBooks: pendingBooksData.data.length || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchData();
  }, []);

  const handleNavigation = (section, path) => {
    setActiveSection(section);
    navigate(path);
    setShowSidebar(false);
  };

  const handleDropdownSelect = (action) => {
    if (action === "home") {
      navigate("/");
    } else if (action === "logout") {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div
      className="d-flex"
      style={{ minHeight: "100vh", backgroundColor: "#f1f5f9" }}
    >
      <Col
        md={3}
        lg={2}
        className="bg-white p-4 shadow-sm d-none d-md-block"
        style={{ height: "100vh" }}
      >
        <div className="d-flex align-items-center mb-4">
          <span className="fw-bold text-dark fs-5">Admin Dashboard</span>
        </div>
        <Nav className="flex-column">
          {[
            { name: "Dashboard", path: "/admin/dashboard", icon: <FiGrid /> },
            {
              name: "Manage User",
              path: "/admin/manage-user",
              icon: <FiUsers />,
            },
            {
              name: "Manage Book",
              path: "/admin/manage-book",
              icon: <FiBook />,
            },
            {
              name: "Approve Book",
              path: "/admin/approve-book",
              icon: <FiCheckCircle />,
            },
          ].map((item, index) => (
            <div
              key={index}
              onClick={() => handleNavigation(item.name, item.path)}
              className={`d-flex align-items-center p-2 rounded cursor-pointer ${
                activeSection === item.name
                  ? "bg-primary text-white"
                  : "text-muted"
              }`}
              style={{ cursor: "pointer" }}
            >
              <div className="me-2 fs-5">{item.icon}</div>
              {item.name}
            </div>
          ))}
        </Nav>
      </Col>

      {/* Main Content */}
      <div className="flex-grow-1">
        {/* Navbar */}
        <Navbar bg="white" expand="md" className="shadow-sm px-3">
          <Button
            variant="light"
            className="d-md-none me-2"
            onClick={() => setShowSidebar(true)}
          >
            <FiMenu />
          </Button>
          <Navbar.Brand className="fw-bold text-dark">Dashboard</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Dropdown onSelect={handleDropdownSelect}>
              <Dropdown.Toggle variant="light" className="fw-semibold">
                Hello, Admin
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="home">Home</Dropdown.Item>
                <Dropdown.Item eventKey="logout">Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Collapse>
        </Navbar>

        {/* Nội dung dashboard */}
        <Container fluid className="p-4">
          <Row className="g-4">
            <Col xs={6} md={3}>
              <div className="bg-white rounded p-4 shadow-sm text-center">
                <h5>Users</h5>
                <h2>{stats.users}</h2>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="bg-white rounded p-4 shadow-sm text-center">
                <h5>Sellers</h5>
                <h2>{stats.sellers}</h2>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="bg-white rounded p-4 shadow-sm text-center">
                <h5>Books</h5>
                <h2>{stats.books}</h2>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="bg-white rounded p-4 shadow-sm text-center">
                <h5>Pending Books</h5> {/* thay đổi nhãn từ Orders -> Pending Books */}
                <h2>{stats.pendingBooks}</h2>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
