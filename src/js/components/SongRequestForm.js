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
          <label style={{color:'black'}} htmlFor="youtube_url">Youtube URL:</label>
          <Field style={{color:'black'}} name="youtube_url" component="input" type="text"/>
        </div>
        <div>
          <label style={{color:'black'}} htmlFor="use_priority">Make Request Priority?  (+5pts)</label>
          <Field name="use_priority" component="input" type="checkbox"/>
        </div>
        <div>
          <label style={{color:'black'}} htmlFor="instrument">Select Instrument (+5pts)</label>
          <div>
            <Field style={{color:'black'}} name="instrument" component="select">
              <option value="none">None</option>
              <option value="piano">Piano</option>
              <option value="guitar">Guitar</option>
              <option value="sax">Sax</option>
            </Field>
          </div>
        </div>
        <button className="button-primary-wide" type="submit">Submit</button>
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
