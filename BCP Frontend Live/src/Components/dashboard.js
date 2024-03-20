import React, { useState, useCallback, useEffect } from 'react';
import { Navbar, NavbarBrand, Nav, NavbarToggle, NavbarCollapse, Button, Form, FormControl, Container, Row, Col, Dropdown } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-bootstrap4';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faEdit, faSave, faTimes, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/dashboard.css';

function Dashboard() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editedRow, setEditedRow] = useState(null);
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
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          const header = jsonData.shift();
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
        }
      };
      reader.readAsBinaryString(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const filteredData = data.filter(row => {
    return Object.values(row || {}).some(value =>
      value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSearchChange = e => {
    setSearchQuery(e.target.value);
  };

  const handleEdit = (row) => {
    console.log("Editing row:", row);
    setEditedRow({ ...row });
  };

  const handleSave = () => {
    console.log("Saving edited row:", editedRow);
    setData(data.map(row => (row.id === editedRow.id ? editedRow : row)));
    setEditedRow(null);
  };

  const handleCancel = () => {
    console.log("Canceling edit for row:", editedRow);
    setEditedRow(null);
  };

  const handleInputChange = (e, key) => {
    const { value } = e.target;
    console.log("Changing value of", key, "to", value, "for edited row");
    setEditedRow(prevRow => ({
      ...prevRow,
      [key]: value
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const formatDateHeading = (header) => {
    const dateParts = header.match(/\b(\w{3} \d{2})\b/);
    return dateParts ? dateParts[0] : header;
  };
const formatDateCell = (value, columnName) => {
  if (typeof value === 'string' && columnName === 'Month/Year') {
    const [month, year] = value.split('/');
    const monthAbbreviation = month.substr(0, 3);
    return `${monthAbbreviation}-${year}`;
  } else if (value instanceof Date) {
    const month = value.toLocaleDateString('en-US', { month: 'short' });
    const year = value.getFullYear().toString().slice(-2);
    return `${month}${year}`;
  }
  return value;
};


  return (
    <div className="dashboard-container">
      <Navbar bg="light" expand="lg" className="w-100">
        <div className="brand-wrapper">
          <NavbarBrand href="#home"> BCP Dashboard</NavbarBrand>
        </div>
        <NavbarToggle aria-controls="basic-navbar-nav" />
        <NavbarCollapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic">
                <FontAwesomeIcon icon={faUser} /> {username}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>Profile</Dropdown.Item>
                <Dropdown.Item>Settings</Dropdown.Item>
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
      <Container fluid>
        <Row>
          <Col>
            <div className="table-responsive render">
              {filteredData.length > 0 && (
                <div className="table-container">
                  <Grid
                    rows={filteredData}
                    columns={Object.keys(filteredData[0] || {}).map(key => ({ name: key, title: formatDateHeading(key) }))}
                  >
                    <Table
                      rowComponent={({ row, ...restProps }) => (
                        <Table.Row
                          {...restProps}
                          key={row.id}
                        >
                          {Object.keys(row).map((key) => (
                          <Table.Cell key={key} column={{ name: key }}>
                          {editedRow && editedRow.id === row.id ? (
                            <FormControl
                              type="text"
                              value={editedRow[key]}
                              onChange={(e) => handleInputChange(e, key)}
                            />
                          ) : (
                            formatDateCell(row[key], key) // Pass the column name here
                          )}
                        </Table.Cell>
                        
                          ))}
                          <Table.Cell>
                            {editedRow && editedRow.id === row.id ? (
                              <>
                                <Button variant="success" onClick={handleSave}>
                                  <FontAwesomeIcon icon={faSave} />
                                </Button>
                                <Button variant="danger" onClick={handleCancel}>
                                  <FontAwesomeIcon icon={faTimes} />
                                </Button>
                              </>
                            ) : (
                              <Button variant="primary" onClick={() => handleEdit(row)}>
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
