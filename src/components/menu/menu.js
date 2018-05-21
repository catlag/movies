import React, { Component } from 'react';
import './menu.css';
import { Form, Button, Checkbox } from 'semantic-ui-react'


class Menu extends Component {

  constructor() {
    super()
    this.state = {
      query: '',
      release_year: false,
      title: false,
      numQuery: false,
    }
  }

  handleChange = (event) => {
    this.setState({
      query: event.target.value
    });
    if (event.target.value){
      this.props.searchFunction(event.target.value, (!isNaN(event.target.value)), this.state.filterYear, this.state.filterTitle)
    }else{
      this.setState({title: false, release_year: false})
      this.props.clearSearchFunction()
    }
  }

  loadMore = (event) =>{
    this.props.searchFunction(this.state.query, !(isNaN(this.state.query)), this.state.filterYear, this.state.filterTitle)
  }

  handleSortChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    if (name === 'release_year'){
      this.setState(prevState => ({
        release_year: !prevState.release_year,
        title: false
      }));
    }else{
      this.setState(prevState => ({
        release_year: false,
        title: !prevState.title
      }));
    }

    this.props.sortFunction(name)
  }

  render() {
    const button = this.props.mobile || this.props.ipad
    return (
      <div className="menu-wrapper">
        <div>
          <p className="menu-title">Movies </p>
          <p className="menu-title">Filmed in Sf</p>

           <Form className="menu-form">
            <Form.Group className="form-input-wrapper">
              <input type="text" placeholder='Search Titles, Years' className="search-input" onChange={this.handleChange} />
            </Form.Group>
            <Form.Group grouped className="form-sort-wrapper">
              <label className="sort-label">Sort Movies</label>
              <Form.Field label='by Year' name='release_year' control='input' type="checkbox" checked={this.state.release_year} onChange={this.handleSortChange}  />
              <Form.Field label='by Title' name='title' control='input'  type="checkbox" checked={this.state.title} onChange={this.handleSortChange} />
            </Form.Group>
          </Form>
        </div>
        {
          !button &&(
            <Button className="load-more-button" onClick={this.loadMore}>More</Button>

          )
        }
      </div>
    );
  }
}

export default Menu;
