import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Rating = ({ value, text, color }) => {
  return (
    <div className='rating'>
      <span style={{ color }}>
        <FontAwesomeIcon icon={
            value >= 1
              ? 'fas fa-star'
              : value >= 0.5
              ? 'fas fa-star-half-alt'
              : 'far fa-star'
          } /> 
      </span>
      <span style={{ color }}>
        <FontAwesomeIcon icon={
              value >= 2
                ? 'fas fa-star'
                : value >= 1.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
            } /> 
      </span>
      <span style={{ color }}>
        <FontAwesomeIcon icon={
              value >= 3
                ? 'fas fa-star'
                : value >= 2.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
            } /> 
        </span>
      <span style={{ color }}>
        <FontAwesomeIcon icon={
              value >= 4
                ? 'fas fa-star'
                : value >= 3.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
            } /> 
      </span>
      <span style={{ color }}>
        <FontAwesomeIcon icon={
              value >= 5
                ? 'fas fa-star'
                : value >= 4.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
            } /> 
      </span>
      <span>{text && text}</span>
    </div>
  )
}

Rating.defaultProps = {
  color: '#f8e825',
}

Rating.propTypes = {
  value: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
}

export default Rating;