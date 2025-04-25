import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Nav, Card, Form, Table, Button, Modal, Badge, Spinner, Alert, Navbar, Offcanvas, Dropdown
} from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiGrid, FiUsers, FiBook, FiShoppingCart, FiMenu } from 'react-icons/fi';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getToken } from '../../../utils/auth';
import { getAllUsers, deleteUser, toggleUserStatus, updateUser } from '../../../service/userApi';

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({ role: '' });
  const [editUser, setEditUser] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [togglingUsers, setTogglingUsers] = useState(new Set());
  const usersPerPage = 5;

  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('Manage User');
  const token = getToken();

  const IMAGE_BASE_URL = 'http://localhost:8080/api/v1/image/show?imageName=';

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUsers(token);
      const normalizedUsers = data.map(user => ({
        ...user,
        active: user.active === true || user.active === 'true'
      }));
      setUsers(normalizedUsers);
    } catch (err) {
      setError(err.message || 'Failed to fetch users. Please try again.');
      setUsers([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    const path = location.pathname;
    if (path.includes('manage-user')) {
      setActiveSection('Manage User');
    } else if (path.includes('manage-book')) {
      setActiveSection('Manage Book');
    } else if (path.includes('approve-requests')) {
      setActiveSection('Approve Requests');
    }
  }, [location.pathname]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(userId, token);
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to delete user. Please try again.');
      console.error(err);
    }
  };

  const handleToggleUserStatus = async (userId, isActive) => {
    if (!window.confirm(`Are you sure you want to ${isActive ? 'disable' : 'enable'} this user?`)) return;
    setTogglingUsers(prev => new Set(prev).add(userId));
    try {
      await toggleUserStatus(userId, !isActive, token);
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to toggle user status. Please try again.');
      console.error('Toggle status error:', err);
    } finally {
      setTogglingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleEditUser = (user) => {
    setEditUser({
      ...user,
      password: '',
      userImage: user.userImage ? `${IMAGE_BASE_URL}${user.userImage}` : null
    });
    setUserImage(null);
  };

  const validateImage = (file) => {
    if (!file) return true;
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024;
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a JPEG, PNG, or GIF image.');
      return false;
    }
    if (file.size > maxSize) {
      setError('File size exceeds 5MB. Please upload a smaller image.');
      return false;
    }
    return true;
  };

  const validateForm = () => {
    if (!editUser.username || editUser.username.trim() === '') {
      setError('Username is required.');
      return false;
    }
    if (!editUser.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editUser.email)) {
      setError('A valid email is required.');
      return false;
    }
    if (!editUser.userRole || !['ADMIN', 'SELLER', 'USER'].includes(editUser.userRole)) {
      setError('A valid role is required.');
      return false;
    }
    return true;
  };

  const handleSaveUser = async () => {
    if (!validateForm()) return;
    if (userImage && !validateImage(userImage)) return;

    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append('username', editUser.username);
      formData.append('fullName', editUser.fullName || '');
      formData.append('email', editUser.email);
      formData.append('phoneNumber', editUser.phoneNumber || '');
      formData.append('userRole', editUser.userRole);
      formData.append('active', editUser.active ? 'true' : 'false');
      formData.append('password', editUser.password || '');
      if (userImage) {
        formData.append('userImage', userImage);
      }

      await updateUser(editUser.userId, formData, token);
      setEditUser(null);
      setUserImage(null);
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to update user. Please try again.');
      console.error('Update user error:', err);
    } finally {
      setUpdating(false);
    }
  };

  // Filter users only by role, ignore searchTerm
  const filteredUsers = Array.isArray(users)
    ? users.filter(user => {
        const matchesFilter = filter.role ? user.userRole === filter.role : true;
        return matchesFilter;
      })
    : [];

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleNavigation = (section, path) => {
    setActiveSection(section);
    navigate(path);
    setShowSidebar(false);
  };

  const handleDropdownSelect = (action) => {
    if (action === 'home') {
      navigate('/');
    } else if (action === 'logout') {
      localStorage.removeItem("token");
      navigate('/login');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      <style>
        {`
          @media (max-width: 768px) {
            .table th, .table td {
              font-size: 0.85rem;
              padding: 0.5rem;
            }
            .form-control {
              margin-bottom: 0.5rem;
            }
            .action-btn {
              font-size: 1.1rem;
              padding: 0.5rem;
            }
            .pagination-btn {
              font-size: 1.2rem;
              padding: 0.5rem;
            }
          }
        `}
      </style>

      {/* Mobile Navbar */}
      <Navbar bg="white" className="shadow-sm d-md-none">
        <Container fluid>
          <Navbar.Brand className="fw-bold text-dark fs-5">Admin Dashboard</Navbar.Brand>
          <div className="d-flex align-items-center">
            <Dropdown align="end">
              <Dropdown.Toggle as="div" style={{ cursor: 'pointer' }} className="d-flex align-items-center">
                <span className="fw-semibold text-dark">Hello Admin</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleDropdownSelect('home')}>Home</Dropdown.Item>
                <Dropdown.Item onClick={() => handleDropdownSelect('logout')}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button variant="link" onClick={() => setShowSidebar(true)} className="ms-2">
              <FiMenu size={20} className="text-dark" />
            </Button>
          </div>
        </Container>
      </Navbar>

      {/* Sidebar for Mobile */}
      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        className="d-md-none"
        style={{ width: '250px' }}
      >
        <Offcanvas.Header closeButton>
          <div className="d-flex align-items-center">
            <span className="fw-bold text-dark fs-5">Admin Dashboard</span>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body className="bg-white p-4">
          <Nav className="flex-column">
            {[
              { name: 'Dashboard', path: '/admin/dashboard', icon: <FiGrid /> },
              { name: 'Manage User', path: '/admin/manage-user', icon: <FiUsers /> },
              { name: 'Manage Book', path: '/admin/manage-book', icon: <FiBook /> },
              { name: 'Approve Book', path: '/admin/approve-book', icon: <FiBook /> },

            ].map((item, index) => (
              <div
                key={index}
                onClick={() => handleNavigation(item.name, item.path)}
                className={`d-flex align-items-center p-2 rounded cursor-pointer ${
                  activeSection === item.name ? 'bg-primary text-white' : 'text-muted'
                }`}
                style={{ cursor: 'pointer' }}
              >
                <div className="me-2 fs-5">{item.icon}</div>
                {item.name}
              </div>
            ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      <Container fluid>
        <Row>
          {/* Sidebar for Desktop */}
          <Col md={3} lg={2} className="bg-white p-4 shadow-sm d-none d-md-block" style={{ height: '100vh' }}>
            <div className="d-flex align-items-center mb-4">
              <span className="fw-bold text-dark fs-5">Admin Dashboard</span>
            </div>
            <Nav className="flex-column">
              {[
                { name: 'Dashboard', path: '/admin/dashboard', icon: <FiGrid /> },
                { name: 'Manage User', path: '/admin/manage-user', icon: <FiUsers /> },
                { name: 'Manage Book', path: '/admin/manage-book', icon: <FiBook /> },
                { name: 'Approve Book', path: '/admin/approve-book', icon: <FiBook /> },
              ].map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleNavigation(item.name, item.path)}
                  className={`d-flex align-items-center p-2 rounded cursor-pointer ${
                    activeSection === item.name ? 'bg-primary text-white' : 'text-muted'
                  }`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="me-2 fs-5">{item.icon}</div>
                  {item.name}
                </div>
              ))}
            </Nav>
          </Col>

          {/* Main Content */}
          <Col md={9} lg={10} className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                Manage User
              </h1>
              <Dropdown align="end">
                <Dropdown.Toggle as="div" style={{ cursor: 'pointer' }} className="d-flex align-items-center">
                  <span className="fw-semibold text-dark">Hello Admin</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleDropdownSelect('home')}>Home</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleDropdownSelect('logout')}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            {error && (
              <Alert variant="danger" onClose={() => setError(null)} dismissible>
                {error}
              </Alert>
            )}

            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Form>
                  <Row className="align-items-center">
                    <Col md={8}>
                      <Form.Control
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Select
                        value={filter.role}
                        onChange={(e) => setFilter({ ...filter, role: e.target.value })}
                      >
                        <option value="">All Roles</option>
                        <option value="ADMIN">Admin</option>
                        <option value="SELLER">Seller</option>
                        <option value="USER">User</option>
                      </Form.Select>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>

            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="mb-4">User List</Card.Title>
                <div style={{ overflowX: 'auto' }}>
                  {loading ? (
                    <div className="text-center my-4">
                      <Spinner animation="border" variant="primary" />
                    </div>
                  ) : (
                    <Table bordered hover>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Username</th>
                          <th>Full Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentUsers.length > 0 ? (
                          currentUsers.map(user => (
                            <tr key={user.userId}>
                              <td>{user.userId}</td>
                              <td>{user.username}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  {user.fullName || 'N/A'}
                                </div>
                              </td>
                              <td>{user.email}</td>
                              <td>{user.phoneNumber || 'N/A'}</td>
                              <td>{user.userRole}</td>
                              <td>
                                <Badge bg={user.active === true ? 'success' : 'danger'}>
                                  {user.active === true ? 'Active' : 'Inactive'}
                                </Badge>
                              </td>
                              <td>
                                <Button
                                  variant="link"
                                  className="text-primary p-0 me-2 action-btn"
                                  onClick={() => handleEditUser(user)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="link"
                                  className={`${user.active ? 'text-secondary' : 'text-success'} p-0 me-2 action-btn`}
                                  onClick={() => handleToggleUserStatus(user.userId, user.active)}
                                  disabled={togglingUsers.has(user.userId)}
                                >
                                  {togglingUsers.has(user.userId) ? (
                                    <Spinner animation="border" size="sm" />
                                  ) : user.active ? 'Disable' : 'Enable'}
                                </Button>
                                <Button
                                  variant="link"
                                  className="text-danger p-0 action-btn"
                                  onClick={() => handleDeleteUser(user.userId)}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" className="text-center text-muted">
                              No users found. Try changing or clearing the role filter.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  )}
                </div>

                <div className="d-flex justify-content-end align-items-center mt-2">
                  <Button
                    variant="link"
                    className="text-primary p-0 me-2 pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    {'<'}
                  </Button>
                  <span className="me-2">{currentPage}</span>
                  <Button
                    variant="link"
                    className="text-primary p-0 me-2 pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    {'>'}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal show={editUser !== null} onHide={() => setEditUser(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editUser && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={editUser.username}
                  onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                  required
                  disabled={updating}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password (leave blank to keep unchanged)</Form.Label>
                <Form.Control
                  type="password"
                  value={editUser.password}
                  onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                  disabled={updating}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editUser.fullName || ''}
                  onChange={(e) => setEditUser({ ...editUser, fullName: e.target.value })}
                  disabled={updating}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  required
                  disabled={updating}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  value={editUser.phoneNumber || ''}
                  onChange={(e) => setEditUser({ ...editUser, phoneNumber: e.target.value })}
                  disabled={updating}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>User Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={(e) => setUserImage(e.target.files[0])}
                  disabled={updating}
                />
                {editUser.userImage && !userImage && (
                  <div className="mt-2">
                    <img
                      src={editUser.userImage}
                      alt="Current user"
                      style={{ maxWidth: '100px', maxHeight: '100px' }}
                      onError={() => setError('Failed to load current image.')}
                    />
                  </div>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={editUser.userRole}
                  onChange={(e) => setEditUser({ ...editUser, userRole: e.target.value })}
                  required
                  disabled={updating}
                >
                  <option value="ADMIN">Admin</option>
                  <option value="SELLER">Seller</option>
                  <option value="USER">User</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={editUser.active ? 'active' : 'inactive'}
                  onChange={(e) => setEditUser({ ...editUser, active: e.target.value === 'active' })}
                  disabled={updating}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditUser(null)} disabled={updating}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveUser} disabled={updating}>
            {updating ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageUser;