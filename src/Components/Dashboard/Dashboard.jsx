import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [departments, setDepartments] = useState(['Tech', 'Marketing', 'Operations']);
  const [filterDepartment, setFilterDepartment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(5);

  useEffect(() => {
    // Fetch employees data from your JSON server
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/employees');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Pagination
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  // Sorting
  const sortedEmployees = [...currentEmployees].sort((a, b) => a.salary - b.salary);

  // Filtering by department
  const filteredEmployees = filterDepartment
    ? sortedEmployees.filter((employee) => employee.department === filterDepartment)
    : sortedEmployees;

  // Searching by first name
  const searchedEmployees = searchTerm
    ? filteredEmployees.filter((employee) =>
        employee.firstName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredEmployees;

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/employees/${id}`);
      setEmployees(employees.filter((employee) => employee.id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  

  const handleFilterChange = (e) => {
    setFilterDepartment(e.target.value);
    setCurrentPage(1); // Reset pagination when changing the filter
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset pagination when changing the search term
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleLogout = () => {
    navigate('/');
  };
  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      <div>
        <label htmlFor="departmentFilter">Filter by Department:</label>
        <select
          id="departmentFilter"
          value={filterDepartment}
          onChange={handleFilterChange}
        >
          <option value="">All Departments</option>
          {departments.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="searchEmployee">Search by First Name:</label>
        <input
          type="text"
          id="searchEmployee"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {searchedEmployees.map((employee) => (
            <tr key={employee.id} style={{ borderBottom: '1px solid #ccc' }}>
              <td>{employee.id}</td>
              <td>{employee.firstName}</td>
              <td>{employee.lastName}</td>
              <td>{employee.email}</td>
              <td>{employee.department}</td>
              <td>{employee.salary}</td>
              <td>
                <button onClick={() => handleEdit(employee)}>Edit</button>
                <button onClick={() => handleDelete(employee.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {/* Pagination */}
        {searchedEmployees.length > employeesPerPage && (
          <div>
            <span>Page {currentPage}</span>
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={indexOfLastEmployee >= searchedEmployees.length}
            >
              Next
            </button>
          </div>
        )}
      </div>
      {isModalOpen && (
        <div>
          {/* Modal for editing employee */}
          <div>
            <h3>Edit Employee</h3>
          
            <button onClick={handleModalClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
