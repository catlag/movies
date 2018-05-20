import React, { Component } from 'react';
import geocoder from 'geocoder-geojson'

import './App.css';
import Menu from '../menu'
import Movies from '../movies'


class App  extends Component {
  constructor() {
  super()
    this.state = {
      movies    : [],
      limit     : 45,
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
    console.log(process.env.REACT_APP_API_TOKEN)
    window.addEventListener('resize', this.updateWindowDimensions);

  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight});
  }

  callApi = (query, numType) => {
    if (query === this.state.query){
        this.setState(prevState => ({
          offset: (prevState.offset + prevState.limit),
          loadMore: true,
        }))
    }else{
      this.setState({
        offset: 0,
        loadMore: false
      })
    }
    var self = this 
    var url
    var search = ("%"+query+"%")
    if (numType){
      url = `https://data.sfgov.org/resource/wwmu-gmzc.json?$$app_token=${process.env.REACT_APP_API_TOKEN}&$limit=${this.state.limit}&$offset=0&$where=title like '${encodeURIComponent(search)}%' OR release_year = '${encodeURIComponent(query)}'`
    }else {
      url = `https://data.sfgov.org/resource/wwmu-gmzc.json?$$app_token=${process.env.REACT_APP_API_TOKEN}&$limit=${this.state.limit}&$offset=${this.state.offset}&$where=title like '${encodeURIComponent(search)}'`
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
                geocoder.google(movie.locations.toString())
                .then(function(geojson){
                  movie['geo'] = geojson.features
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
            console.log(component.state.loadMore)
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

  filterData = (type) => {
    var arr;
    if (type === 'title'){
      var re = /([a-z]+)(\d+)(.+)/i;

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
          <Menu searchFunction={this.callApi} sortFunction={this.filterData} ipad={ipad} mobile={mobile}/>
          <Movies movies={this.state.movies} ipad={ipad} mobile={mobile} />
        </div>
      </div>
    );
  }
}

export default App;
