import { Container, Navbar, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function Dashboard() {

  const handleLogout = () => {
    
    console.log('Logging out...');
  };  

  return (
    <div className="form d-flex flex-column justify-content-start align-items-center vh-100">

      <Navbar bg="light" expand="lg" className="w-100">
        <Container>
          <Navbar.Brand href="#home">Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Link to="/logout">
              <Button variant="danger" onClick={handleLogout}>Logout</Button>
            </Link>
          </Navbar.Collapse>
        </Container>
      </Navbar>

    </div>
  );
}

export default Dashboard;
