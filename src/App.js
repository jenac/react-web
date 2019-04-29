import React, { Component } from 'react';
import { Navbar, Table, DropdownButton, Dropdown } from 'react-bootstrap';
import good from './good.png';
import bad from './bad.png';
import normal from './normal.png';
import stop from './stop.png';
import warning from './warning.png';
import './App.css';
const api_host = 'https://watch-function.azurewebsites.net/api';
const recent_key = 'CisCFacJmQALOVR9gCJtM0AMg1XQ2BnamR8k6TSulqfrv5Sx70HPkA==';
const iod_key = 'kr04KSYiIIUo4QvJeZqa6TdMnmy/fOm44KAa9eTam8CyEHHnhTS5Hg==';

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoaded: false,
      dates: [],
      error: null,
      selectedDate: 'Select Date',
      stocks: [],
    } 
  }

  componentDidMount() {
    fetch(`${api_host}/recent?symbol=SPY&code=${recent_key}`, { mode: "cors", headers: {"Content-Type": "application/json"}})
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          dates: result
        });
      },
      (error) => {
        this.setState({
          error
        });
      }
    )
  }

  render() {
    return (
      <div className="App">

        <Navbar className="bg-light justify-content-between">
          <h3>{this.state.selectedDate}</h3>
          
            <DropdownButton id="dropdown-basic-button" 
              variant="success" 
              title={this.state.selectedDate} 
              onSelect={
                (e)=> {
                  this.setState({ selectedDate: e});
                  fetch(`${api_host}/iods?date=${e}&code=${iod_key}`, { mode: "cors", headers: {"Content-Type": "application/json"}})
                    .then(res => res.json())
                    .then(
                      (result) => {
                        this.setState({
                          stocks: result
                        });
                      },
                      (error) => {
                        this.setState({
                          error
                        });
                      }
                    )
                }
            }>
              {
                this.state.dates.map(
                  i => <Dropdown.Item key={i} eventKey={i}>{i}</Dropdown.Item>
                )
              }
            </DropdownButton>
          
        </Navbar>
        <div>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Sign</th>
                <th>SMA GOOD</th>
                <th>RSI</th>
                <th>Price@Rsi70</th>
                <th>Return 200</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.stocks.map (
                  s => <tr>
                  <td>{s.symbol}</td>
                  <td><img src = {
                      (s.currentRsi > 69.0) ? warning : 
                        ((s.currentRsi > 49.0) ? normal : stop)
                    } alt="sign"></img></td>
                  <td><img src = {s.smaGood ? good : bad} alt="smaGood"></img></td>
                  <td>{s.currentRsi}</td>
                  <td>{s.priceAt70}</td>
                  <td>{s.return200}</td>
                </tr>
                )
              }
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default App;
