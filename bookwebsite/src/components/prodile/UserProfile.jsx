import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Row, Col, Button, Image, Form, Card,
} from "react-bootstrap";
import { getUserById, updateUser } from "../../service/userApi";

const UserProfile = () => {
  const navigate = useNavigate();
  const userId = parseInt(localStorage.getItem("userId"));
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    active: true,
  });
  const [originalData, setOriginalData] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fileInputRef = useRef(null);

  const IMAGE_BASE_URL = "http://localhost:8080/api/v1/image/show?imageName=";

  useEffect(() => {
    if (!token || !userId) {
      navigate("/login");
      return;
    }

    setLoading(true);
    getUserById(userId, token)
      .then((res) => {
        const data = res.data;
        const initialData = {
          fullName: data.fullName || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          password: "",
          role: data.userRole || "",
          active: data.active,
        };
        setFormData(initialData);
        setOriginalData(initialData);
        if (data.userImage) {
          const imgUrl = `${IMAGE_BASE_URL}${data.userImage}`;
          setUserImage(imgUrl);
          setOriginalImage(imgUrl);
        } else {
          setUserImage("/avatar.png");
          setOriginalImage("/avatar.png");
        }
      })
      .catch(() => {
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [token, userId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(file);
      setUserImage(URL.createObjectURL(file)); // preview ảnh mới
    }
  };

  const handleSave = async () => {
    const form = new FormData();
    form.append("fullName", formData.fullName.trim());
    form.append("email", formData.email.trim());
    form.append("phoneNumber", formData.phoneNumber.trim());
    if (formData.password && formData.password.length >= 6) {
      form.append("password", formData.password.trim());
    }
    form.append("active", formData.active);
    form.append("userRole", formData.role);
    if (editImage) {
      form.append("userImage", editImage);
    }

    try {
      await updateUser(userId, form, token);
      alert("Profile updated successfully!");
      setIsEditing(false);
      setOriginalData(formData);
      setOriginalImage(userImage);
      setEditImage(null);
    } catch (error) {
      console.error(error);
      alert("Update failed!");
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setUserImage(originalImage);
    setEditImage(null);
    setIsEditing(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;

  return (
    <Container className="py-4">
      <Card className="p-4 shadow-sm rounded-4" style={{ maxWidth: "800px", margin: "0 auto", position: "relative" }}>
        {/* Nút Edit ở góc phải */}
        {!isEditing && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsEditing(true)}
            style={{ position: "absolute", top: "20px", right: "20px" }}
          >
            Edit
          </Button>
        )}
        
        <div className="text-center mb-4">
          <Image
            src={userImage}
            roundedCircle
            width="100"
            height="100"
            className="border"
            onError={() => setUserImage("/avatar.png")}
          />
          <div className="mt-3">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={triggerFileInput}
              disabled={!isEditing}
            >
              Change Avatar
            </Button>
            <Form.Control
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
        </div>

        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={`bg-light border rounded-3 ${isEditing ? "border border-primary" : ""}`}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={`bg-light border rounded-3 ${isEditing ? "border border-primary" : ""}`}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={`bg-light border rounded-3 ${isEditing ? "border border-primary" : ""}`}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>New Password (optional)</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  placeholder="Leave blank to keep current password"
                  className={`bg-light border rounded-3 ${isEditing ? "border border-primary" : ""}`}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  value={formData.active ? "Active" : "Inactive"}
                  disabled
                  className="bg-light border rounded-3 text-muted"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  value={formData.role}
                  disabled
                  className="bg-light border rounded-3 text-muted"
                />
              </Form.Group>
            </Col>
          </Row>

          {isEditing && (
            <div className="d-flex justify-content-center gap-3 mt-4">
              <Button variant="success" onClick={handleSave}>
                Save
              </Button>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </Form>
      </Card>
    </Container>
  );
};

export default UserProfile;
