import React, { Component } from 'react';
import './movies.css';
import { Button } from 'semantic-ui-react'


class Movies extends Component {

  constructor() {
    super()
    this.state = {
      moviesWithCoordinates: []
    }
  }

  componentWillReceiveProps(nextProps){
     this.setState({moviesWithCoordinates: nextProps.movies})

  }

  coordinates = (movie, type) => {
    console.log(movie)
    if (type === 'lat'){
      return (movie.geo && movie.geo.length > 0) ? movie.geo[0].geometry.coordinates[0] : false
    }else{
      return (movie.geo && movie.geo.length > 0) ? movie.geo[0].geometry.coordinates[1] : false
    }
   
  }

  render() {
    const isipad = this.props.ipad 

    return (
      <div className="movies-wrapper">
        {
          this.state.moviesWithCoordinates.length > 0 && (
            this.state.moviesWithCoordinates.map ((movie, index) =>  
              <div className='movie-wrapper' onClickFunction=''>
                <div className="movie-name-date-wrapper">
                  <p className="title">{movie.title}</p>
                  <p className="grey">{movie.release_year}</p>
                </div>
                {(movie.geo != [] && !isipad)&&(
                  <p className='location grey'>Location:</p>
                )}
                {movie.geo  &&(
                <div className="coordinates">
                  <p>{movie.geo.lat}</p>
                  <p>{movie.geo.lng}</p>
                </div>
                )}
              </div>
              )
            )
        }
        {
          this.props.ipad && this.state.moviesWithCoordinates.length > 0 &&(
            <div className="load-more-wrapper">
              <Button className="load-more-button-movies" onClick={this.loadMore}>More</Button>
            </div>
          )
        }
      </div>
    );
  }
}

export default Movies;
