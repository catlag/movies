import React, { Component } from 'react';
import './movies.css';
import { Button, Icon } from 'semantic-ui-react'


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

  loadMore = (event) =>{
    this.props.searchFunction(this.props.query, !(isNaN(this.props.query)))
  }

  render() {
    const isMobile =  (this.props.ipad || this.props.mobile)

    return (
      <div className="movies-wrapper">
        {
          this.state.moviesWithCoordinates.length > 0 && (
            this.state.moviesWithCoordinates.map ((movie, index) =>  
              <div className='movie-wrapper' key={index.toString()} >
                <div className="movie-name-date-wrapper">
                  <p className="title">{movie.title}</p>
                  <p className="grey">{movie.release_year}</p>
                </div>
                {(movie.geo != [] && !isMobile)&&(
                  <p className='location grey'>Location:</p>
                )}
                {movie.geo  &&(
                <div className="coordinates-wrapper">
                  <a href={`https://www.google.com/maps/?q=${movie.geo.lat},${movie.geo.lng}`} target="_blank" className="grey">
                    {
                      isMobile ? (
                        <div className='coordinates'>
                          <span>{movie.geo.lat.toFixed(2)},</span>
                          <span>{movie.geo.lng.toFixed(2)}</span>
                          <Icon name='map'  />
                        </div>
                      ): (
                        <div className='coordinates'>
                          <div>
                            <p>{movie.geo.lat.toFixed(2)}</p>
                            <p>{movie.geo.lng.toFixed(2)}</p>
                          </div>
                          <Icon name='map'  />
                        </div>
                      )
                    }
                  </a>
                </div>
                )}
              </div>
              )
            )
        }
        {
           isMobile && this.state.moviesWithCoordinates.length > 0 &&(
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
