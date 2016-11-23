import React, { Component } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux'

const validate = values => {
  const errors = {}
  if (!values.youtube_url) {
    errors.youtube_url = 'Required'
  } else if (!/^http:\/\/(?:www\.)?youtube.com\/watch\?(?=.*v=\w+)(?:\S+)?$/i.test(values.youtube_url)) {
    errors.youtube_url = 'Invalid youtube link'
    //TODO: make this support https youtbez
  }
  return errors
}

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} placeholder={label} type={type}/>
      {touched && error && <span>{error}</span>}
    </div>
  </div>
)

let SongRequestForm = (props) => {
  const { error, handleSubmit, pristine, reset, submitting, pointsTotal, valid} = props
    return (
      <form onSubmit={handleSubmit} style={{color: "black"}}>
        <div>
          <Field name="youtube_url" component={renderField} type="text" label="Youtube URL"/>
        </div>
        <div>
          <label htmlFor="use_priority">Make Request Priority?  (+5pts)</label>
          <Field name="use_priority" component="input" type="checkbox"/>
        </div>
        <div>
          <label htmlFor="instrument">Select Instrument (+5pts)</label>
          <div>
            <Field name="instrument" component="select">
              <option value="none">None</option>
              <option value="piano">Piano</option>
              <option value="guitar">Guitar</option>
              <option value="sax">Sax</option>
            </Field>
          </div>
        </div>
        <pre>
          {error}
          </pre>
        <p>You have {props.creditBalance} request credits. {(pointsTotal > props.creditBalance) ? "Looks like you need more!" : ""}</p>

          <button type="submit" disabled={pristine || submitting || !valid || (pointsTotal > props.creditBalance)}>Submit for {pointsTotal} points</button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
      </form>
    );
}

// // Decorate the form component
SongRequestForm = reduxForm({
  form: 'songrequest', // a unique name for this form
  validate,
})(SongRequestForm);

const selector = formValueSelector('songrequest') // <-- same as form name
SongRequestForm = connect(
  state => {
    // can select values individually
    var pointsTotal = 0;
    if(selector(state, 'use_priority'))
      pointsTotal += 5;
    let instrument = selector(state, 'instrument');
    if(instrument != "none" && instrument !== undefined)
      pointsTotal += 5;
    return {
      pointsTotal
    }
  }
)(SongRequestForm)


export default SongRequestForm;
// export default reduxForm({
//   form: 'songrequest',
//   validate
// })(SongRequestForm)
