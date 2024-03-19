import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory hook
import { CloudUpload, Trash } from 'react-bootstrap-icons';

import {
  Navbar,
  NavbarBrand,
  Nav,
  NavbarToggle,
  NavbarCollapse,
  Button,
  Form,
  FormControl,
  Container,
  Row,  
  Col,
  Dropdown
} from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { Link, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import {
  Grid,
  Table,
  TableHeaderRow
} from '@devexpress/dx-react-grid-bootstrap4';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faUser,
  faEdit,
  faSave,
  faTimes,
  faTrash,
  faUpload
} from '@fortawesome/free-solid-svg-icons'; // Import user, edit, and save icons
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/dashboard.css';

function Dashboard() {
  const [username, setUsername] = useState('');
  const [editedRow, setEditedRow] = useState(null);

  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editedValues, setEditedValues] = useState({});
  
  const navigate = useNavigate();

 
useEffect(() => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (!isLoggedIn) {
    navigate('/login');
  } else {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);
 
  }
}, [navigate]);
const onDrop = useCallback(acceptedFiles => {
  acceptedFiles.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      try {
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Specify header row index
        const header = jsonData.shift(); // Extract header row
        const newJsonData = jsonData.map(row => {
          const obj = {};
          header.forEach((key, index) => {
            obj[key] = row[index];
          });
          return obj;
        });
        console.log('New JSON Data:', newJsonData); 
        setData(prevData => [...prevData, ...newJsonData]);
      } catch (error) {
        console.error('Error reading file:', error);
        // Handle error gracefully, e.g., show a message to the user
      }
    };
    reader.readAsBinaryString(file);
  });
}, []);


  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const filteredData = data.filter(row => {
    return Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSearchChange = e => {
    setSearchQuery(e.target.value);
  };

  const handleEdit = (id) => {
    console.log("Editing row:", id);
    setEditedValues(prevValues => ({
      ...prevValues,
      [id]: { ...data.find(row => row.id === id) }
    }));
  };

  const handleSave = (id) => {
    console.log("Saving edited values for row:", id);
    setData(data.map(row => (row.id === id ? { ...row, ...editedValues[id] } : row)));
    setEditedValues(prevValues => {
      const updatedValues = { ...prevValues };
      delete updatedValues[id];
      return updatedValues;
    });
  };
  
  const handleCancel = (id) => {
    console.log("Canceling edit for row:", id);
    setEditedValues(prevValues => {
      const updatedValues = { ...prevValues };
      delete updatedValues[id];
      return updatedValues;
    });
  };
  
  const handleInputChange = (e, id, key) => {
    const { value } = e.target;
    console.log("Changing value of", key, "to", value, "for row:", id);
    setEditedValues(prevValues => ({
      ...prevValues,
      [id]: {
        ...prevValues[id],
        [key]: value
      }
    }));
  };
  const handleLogout = () => {
    // Clear user information from local storage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');

    navigate('/login');
  };


  return (
    <div className="dashboard-container">



      
      <Navbar bg="light" expand="lg" className="w-100">
    <div className="brand-wrapper">
      <NavbarBrand href="#home"  > BCP Dashboard</NavbarBrand>
    </div>


    <NavbarToggle aria-controls="basic-navbar-nav" />
    <NavbarCollapse id="basic-navbar-nav">
      <Nav className="ml-auto">
        <Dropdown>
          <Dropdown.Toggle id="dropdown-basic">
            <FontAwesomeIcon icon={faUser} /> {username}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item >Profile</Dropdown.Item>
            <Dropdown.Item >Settings</Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>


          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    </NavbarCollapse>
  </Navbar>


  <Container fluid>
  <div className="container-fluid full-height mt-5">
    <div className="row">
      <div className="col">
        <div className="border shadow p-3 d-flex justify-content-between align-items-center">
          <Form className="d-flex">
            <div className="search-wrapper mr-2">
              <div className="search-icon">
                <FontAwesomeIcon icon={faSearch} />
              </div>
              <FormControl 
                type="text" 
                placeholder="Search" 
                style={{ flex: '1' }} 
                value={searchQuery}
                onChange={handleSearchChange} 
              />
            </div>
            <div {...getRootProps()} className="custom-file-upload">
              <input {...getInputProps()} accept=".xlsx, .xls" />
              {isDragActive ?
                <p>Drop the files here ...</p> :
                <Button className='btn btn-success btn-sm'><FontAwesomeIcon icon={faUpload} />Upload File</Button>
              }
            </div>
          </Form>
          <div className="ml-4">
            <Button className="mr-2">Submit</Button>
            <Button variant="danger"><FontAwesomeIcon icon={faTrash} /> Clear</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</Container>




      <br />
      
      <Container fluid className='render'>
  <Row>
    <Col>
      <div className="table-responsive" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        {filteredData.length > 0 && (
          <div className="table-container">
            <Grid
              rows={filteredData}
              columns={Object.keys(filteredData[0] || {}).map((key, index) => ({
                name: key,
                title: index === 0 ? 'Date' : key // Change the title to 'Date' for the first column
              }))}
            >
              <Table
                rowComponent={({ row, ...restProps }) => (
                  <Table.Row
                    {...restProps}
                    // Add a unique key to each row
                    key={row.id}
                  >
                    {Object.keys(row).map((key, index) => (
                      <Table.Cell
                        key={key}
                        column={{ name: key }}
                      >
                        {index === 0 && row[key] instanceof Date ? row[key] : index === 0 ? new Date(row[key]).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) : row[key]}
                      </Table.Cell>
                    ))}
                    <Table.Cell>
                      {editedValues[row.id] ? (
                        <>
                          <Button variant="success" onClick={() => handleSave(row.id)}>
                            <FontAwesomeIcon icon={faSave} />
                          </Button>
                          <Button variant="danger" onClick={() => handleCancel(row.id)}>
                            <FontAwesomeIcon icon={faTimes} />
                          </Button>
                        </>
                      ) : (
                        <Button variant="primary" onClick={() => handleEdit(row.id)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                      )}
                    </Table.Cell>
                  </Table.Row>
                )}
              />

              <TableHeaderRow />
            </Grid>
          </div>
        )}
      </div>
    </Col>
  </Row>
</Container>

    </div>
  );
}

export default Dashboard;
