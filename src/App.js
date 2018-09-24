import React, { Component } from 'react';
import styled from 'styled-components';
import './App.css';


const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const isSearched = searchTerm => item => 
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {

  constructor(props) {
    super(props);

    this.state = { 
      result: null,
      searchTerm: DEFAULT_QUERY,
    };

  };

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  };

  fetchSearchTopStories = searchTerm => {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
    .then(response => response.json())
    .then(result => this.setSearchTopStories(result))
    .catch(error => error);
  };

  onSearchSubmit = (event) => {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  };

  setSearchTopStories = result => this.setState({ result });

  onDismiss = id => {
    const updatedHits = this.state.result.hits.filter(item => item.objectID !== id);
    this.setState({ 
      result: { ...this.state.result, hits: updatedHits }
    });
  };

  onSearchChange = event => {
    this.setState({ searchTerm: event.target.value });
  };

  render() {
    const { searchTerm, result } = this.state;

    if(!result) { return null; };

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Поиск
          </Search>
        </div>
        { result &&
          <Table 
            list={result.hits}
            onDismiss={this.onDismiss}
          />
        }
      </div>
    );
  }
}

const Search = ({
  value, 
  onChange,
  onSubmit, 
  children
}) =>
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        />
      <button type="submit">
        {children}
      </button>
    </form>

const Table = ({list, pattern, onDismiss}) =>
  <div className="table">
    {list.map(item =>
      <div key={item.objectID} className="table-row">
        <span style={{ width: '40%'}}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={{ width: '30%'}}>
          {item.author}
        </span>
        <span style={{ width: '10%'}}>
          {item.num_comments}
        </span>
        <span style={{ width: '10%' }}>
          {item.points}
        </span>
        <span style={{ width: '10%' }}>
          <Button 
            onClick={() => onDismiss(item.objectID)}
            className="btton-inline"
          >
            Отбросить
          </Button>
        </span>
      </div>
    )}
  </div>

const Button = ({onClick,className = '',children}) =>
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>

export default App;