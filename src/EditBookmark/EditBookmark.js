import React, { Component } from 'react';
import './EditBookmark.css';
import BookmarksContext from '../BookmarksContext';
import config from '../config';

const Required = () => (
    <span className='AddBookmark__required'>*</span>
  )

class EditBookmark extends Component {
    constructor(props){
        super(props);
        this.state = {
            id: null,
            error: null,
            title: null,
            url: null,
            value: '',
            rating: null
        }
    }

    static contextType = BookmarksContext


    handleClickCancel = () => {
        this.props.history.push('/')
    }
    

    handleTitleChange = (e) => {
        const newTitle = e.target.value
        this.setState({
            title: newTitle
        })
    }

    handleUrlChange = (e) => {
        const newUrl = e.target.value
        this.setState({
            url: newUrl
        })
    }

    handleRatingChange = (e) => {
        const newRating = e.target.value
        this.setState({
            raing: newRating
        })
    }


    handleDescriptionChange = (e) => {
        const newDescription = e.target.value
        this.setState({
            value: newDescription
        })
    }

    insertOriginalContent = (responseInfo) => {
        this.setState({
            id: responseInfo.id,
            title: responseInfo.title,
            rating: responseInfo.rating,
            url: responseInfo.url,
            value: responseInfo.description
        })
    }

    componentDidMount(){
        fetch(config.API_ENDPOINT + '/' + this.props.match.params.bookmarkId , {
            method: 'GET',
            headers: {
              'content-type': 'application/json',
              'Authorization': `Bearer ${config.API_KEY}`
            }
          })
            .then(res => {
              if (!res.ok) {
                throw new Error(res.status)
              }
              return res.json()
            })
            .then(res => {
                this.insertOriginalContent(res)
            })
            .catch(error => this.setState({ error }))        
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const updatedContent = {
            id: this.state.id,
            title: this.state.title,
            url: this.state.url,
            rating: this.state.rating,
            description: this.state.value
        }

        fetch(config.API_ENDPOINT + '/' + this.props.match.params.bookmarkId , {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${config.API_KEY}`
              },
            body: JSON.stringify(updatedContent),
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then( error => {
                    throw error
                })
            } 
            return res
        })
        .then(() => {
            this.context.updateBookmark(updatedContent)
            this.props.history.push('/')
        })
        .catch( error => {
            this.setState({
                error
            })
        })
    }

    render(){
        const { error } = this.state
        return(
            <section className='EditBookmark'>
            <h2>Create a bookmark</h2>
            <form
              className='EditBookmark__form'
              onSubmit={ e => this.handleSubmit(e)}
            >
              <div className='EditBookmark__error' role='alert'>
                {error && <p>{error.message}</p>}
              </div>
              <div>
                <label htmlFor='title'>
                  Title
                  {' '}
                  <Required />
                </label>
                <input
                  type='text'
                  name='title'
                  id='title'
                  defaultValue={this.state.title}
                  onChange={e => this.handleTitleChange(e)}
                  required
                />
              </div>
              <div>
                <label htmlFor='url'>
                  URL
                  {' '}
                  <Required />
                </label>
                <input
                  type='url'
                  name='url'
                  id='url'
                  onChange={e => this.handleUrlChange(e)}
                  defaultValue={this.state.url}
                  required
                />
              </div>
              <div>
                <label htmlFor='description'>
                  Description
                </label>
                <textarea
                  name='description'
                  id='description'
                  value={this.state.value}
                  onChange={e => this.handleDescriptionChange(e)}
                />
              </div>
              <div>
                <label htmlFor='rating'>
                  Rating
                  {' '}
                  <Required />
                </label>
                <input
                  type='number'
                  name='rating'
                  id='rating'
                  onChange={e => this.handleRatingChange(e)}
                  defaultValue={this.state.rating}
                  min='1'
                  max='5'
                  required
                />
              </div>
              <div className='EditBookmark__buttons'>
                <button type='button' onClick={this.handleClickCancel}>
                  Cancel
                </button>
                {' '}
                <button type='submit'>
                  Save
                </button>
              </div>
            </form>
          </section>            
        )
    }
}

export default EditBookmark;