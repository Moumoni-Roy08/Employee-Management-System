import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserManagement.css";

export default function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); 
  const [errors, setErrors] = useState({}); 
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;


  useEffect(() => {
    axios.get("http://localhost:8081/api/employees")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  // Validate inputs
  const validate = () => {
    let newErrors = {};

    if (!name.trim()) newErrors.name = "⚠️ Name is required";
    if (!email.trim()) newErrors.email = "⚠️ Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "⚠️ Invalid email format";
    else if (users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) 
      newErrors.email = "⚠️ Email already exists";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add new user
  const addUser = () => {
    if (!validate()) return;

    axios.post("http://localhost:8081/api/employees", { name: name.trim(), email: email.trim() })
      .then(res => {
        setUsers([...users, res.data]);
        setName("");
        setEmail("");
        setErrors({});
        alert("✅ User added successfully!");
      })
      .catch(err => console.error(err));
  };

  // Delete user
  const deleteUser = (id) => {
    axios.delete(`http://localhost:8081/api/employees/${id}`)
      .then(() => {
        setUsers(users.filter(user => user.id !== id));
        alert("❌ User deleted successfully!");
      })
      .catch(err => console.error(err));
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(user.id).includes(searchTerm)
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const nextPage = () => {
    if (indexOfLastUser < filteredUsers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <i className="fas fa-users"></i>
            <h1>Admin Dashboard</h1>
          </div>
          <nav className="nav-menu">
            <a href="#"><i className="fas fa-home"></i> Home</a>
            <a href="#"><i className="fas fa-user-cog"></i> Admin</a>
            <a href="#"><i className="fas fa-cog"></i> Settings</a>
          </nav>
          <div className="user-actions">
            <button className="notification-btn">
              <i className="fas fa-bell"></i>
              <span className="notification-badge">3</span>
            </button>
            <div className="user-profile">
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=6c8cff&color=fff" alt="Admin User" />
              <span>Admin User</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="user-management-container">
          <div className="content-header">
            <h2>User Management</h2>
            <p>Manage your system users efficiently</p>
          </div>
          
          <div className="search-container">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search by id, name or email"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="add-user-form">
            <h3>Add New User</h3>
            <div className="form-inputs">
              <input 
                type="text" 
                placeholder="Name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className={errors.name ? "error" : ""}
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className={errors.email ? "error" : ""}
              />
              <button onClick={addUser} className="btn-add">
                <i className="fas fa-plus-circle"></i> Add User
              </button>
            </div>
            <div className="error-messages">
              {errors.name && <p>{errors.name}</p>}
              {errors.email && <p>{errors.email}</p>}
            </div>
          </div>

          {currentUsers.length > 0 ? (
            <div className="table-container">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <button 
                          onClick={() => deleteUser(user.id)} 
                          className="btn-delete"
                        >
                          <i className="fas fa-trash-alt"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-users">No users found.</p>
          )}

          <div className="pagination">
            <button 
              onClick={prevPage} 
              disabled={currentPage === 1}
              className={currentPage === 1 ? "disabled" : ""}
            >
              Prev
            </button>
            <span>Page {currentPage}</span>
            <button 
              onClick={nextPage} 
              disabled={indexOfLastUser >= filteredUsers.length}
              className={indexOfLastUser >= filteredUsers.length ? "disabled" : ""}
            >
              Next
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>User Management System</h4>
            <p>Efficiently manage users with our powerful admin tools.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact Us</h4>
            <p>Email: support@usermanagement.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-linkedin"></i></a>
              <a href="#"><i className="fab fa-github"></i></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2023 User Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
//   .map() → render rows in table.

// .filter() → search users.

// .some() → check duplicates.

// .slice() → pagination.
  // Fetch users on mount

//   useState:

// To store dynamic values (users, name, email, searchTerm, errors, currentPage).

// Controlled form inputs (value + onChange).

// useEffect:

// To perform side effects (fetch data on mount).

// Dependency array [] ensures it runs only once.