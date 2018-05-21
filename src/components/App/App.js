import React, { Component } from 'react';
import './App.css';
import Menu from '../menu'
import Movies from '../movies'


class App  extends Component {
  constructor() {
  super()
    this.state = {
      movies    : [],
      limit     : 25,
      offset    : 0,
      query     : '',
      loadMore  : false,
      width     : 0,
      height    : 0,
    }
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    this.callApi = this.callApi.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);

  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight});
  }

  callApi = (query, numType) => {
    var offset = this.state.offset
    if (query === this.state.query){
        offset += this.state.limit
        this.setState(prevState => ({
          offset: (prevState.offset + prevState.limit),
          loadMore: true,
        }))
    }else{
      offset = 0
      this.setState({
        offset: 0,
        loadMore: false
      })
    }
    console.log(offset)
    var self = this;
    var url;
    var search = ("%"+query+"%");
    if (numType){
      url = `https://data.sfgov.org/resource/wwmu-gmzc.json?$$app_token=${process.env.REACT_APP_API_TOKEN}&$limit=${this.state.limit}&$offset=${offset}&$where=title like '${encodeURIComponent(search)}%' OR release_year = '${encodeURIComponent(query)}'`
    }else {
      url = `https://data.sfgov.org/resource/wwmu-gmzc.json?$$app_token=${process.env.REACT_APP_API_TOKEN}&$limit=${this.state.limit}&$offset=${offset}&$where=title like '${encodeURIComponent(search)}'`
    }
    fetch(url)
      .then(function(resp){
        return (resp.json())
      }) 
      .then(function(data) {
        var component = self 
        var promise = new Promise(function(resolve) {
          var count = 1;
          data.forEach(function(movie){
            if (movie.locations){
              var location = movie.locations + "San Francisco"
              fetch(`${process.env.REACT_APP_GOOGLE_URL}${location}&key=${process.env.REACT_APP_API_GOOGLE_TOKEN}`).then(function(resp){
                return resp.json()
              }).then(function(geo){
                movie['geo'] = geo.results[0].geometry.location;
                 count += 1;  
                  if (count === data.length){
                    resolve(data)
                  }
              })
            }else{
              count += 1         
              if (count === data.length){
                resolve(data)
              }
            }
          })
        });

        Promise.all([promise]).then(values => {
            if (component.state.loadMore){
              component.setState(prevState => ({
                movies: prevState.movies.concat(values[0]),
               query: query
             }))
            }else {
              component.setState({movies: values[0], query: query})
            }
          }).catch(reason => { 
            console.log(reason)
          });
      })
  }

  clearSearchData = () => {
    this.setState({query: '', movies: [], limit : 25, offset : 0})
  }

  filterData = (type) => {
    var arr;
    if (type === 'title'){
      arr = this.state.movies.sort( function(a,b){
         var ax = [], bx = [];

          a.title.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
          b.title.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });
          
          while(ax.length && bx.length) {
              var an = ax.shift();
              var bn = bx.shift();
              var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
              if(nn) return nn;
          }

          return ax.length - bx.length;
      });

    }else{
      arr = this.state.movies.sort(function (a, b) { return (a[type] - b[type] )});
    }
      this.setState({movies: arr})
  }


  render() {
    const ipad = (this.state.width === 768 && this.state.height === 1024) || (this.state.width === 1024 && this.state.height === 1366) ? true : false
    const mobile = this.state.width < 600 ? true : false
    return (
      <div className="App">
        <div className='container'>
          <Menu searchFunction={this.callApi} clearSearchFunction={this.clearSearchData} sortFunction={this.filterData} ipad={ipad} mobile={mobile}/>
          <Movies movies={this.state.movies} ipad={ipad} mobile={mobile} />
        </div>
      </div>
    );
  }
}

export default App;
