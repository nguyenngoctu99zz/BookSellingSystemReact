import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button } from "react-bootstrap";
import { postLogin } from "../../service/securityAPI";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const res = await postLogin(username, password);
      console.log("API Response:", res);

      if (res.data.code === 0 && res.data.data.accessToken) {
        localStorage.setItem("token", res.data.data.accessToken);
        localStorage.setItem("userId", res.data.data.userId);
        navigate("/");
      } else {
        alert(res.data.message || "Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.data) {
        alert(error.response.data.message);
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card
        className="p-4 shadow-sm"
        style={{
          width: "400px",
        }}
      >
        <h3 className="text-center mb-3 fw-bold">Login</h3>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            variant="primary1"
            type="submit"
            className="w-100"
            style={{ backgroundColor: "#007bff", color: "white" }}
          >
            Login
          </Button>
        </Form>
        <div className="text-center mt-3">
          <p>
            Do you have an account yet? <a href="/register">Sign Up</a>
          </p>
        </div>
      </Card>
    </Container>
  );
};

export default Login;
