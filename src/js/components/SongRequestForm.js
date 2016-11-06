import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';


const validate = values => {
  const errors = {}
  if (!values.youtube_url) {
    errors.youtube_url = 'Required'
  // } else if (!/^http:\/\/(?:www\.)?youtube.com\/watch\?(?=.*v=\w+)(?:\S+)?$/i.test(values.youtube_url)) {
  //   errors.youtube_url = 'Invalid email address'
  }

  return errors
}


class SongRequestForm extends Component {
  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="youtube_url">Youtube URL</label>
          <Field className="light-textbox" name="youtube_url" component="input" type="text"/>
        </div>
        <button type="submit">Submit</button>
      </form>
    );
  }
}

// Decorate the form component
SongRequestForm = reduxForm({
  form: 'songrequest', // a unique name for this form
  validate,
})(SongRequestForm);

export default SongRequestForm;
