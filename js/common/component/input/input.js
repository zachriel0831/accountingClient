import React, { Component } from 'react'

class Input extends Component {
  render() {
    // Provided by Redux Form:
    // { input, label, type, meta: { touched, error } }
    const {
      input,
      label,
      meta: {
        touched,
        error
      },
      placeholder,
      type,
      disabled,
      handleInputRemoval,
      optionalClasses,
    } = this.props

    return (
      <div>

      </div>
    )
  }
}

export default Input
