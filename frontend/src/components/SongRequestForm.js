import React, { Component } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';

function ytVidId (url) {
  var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  return (url.match(p)) ? RegExp.$1 : false;
}

const validate = (values) => {
  const errors = {};
  if (!values.youtube_url) {
    errors.youtube_url = 'Required';
  } else if (!ytVidId(values.youtube_url)) {
    errors.youtube_url = 'Invalid youtube link';
    // TODO: make this support https youtbez
  }
  return errors;
};

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    {/* <label>{label}</label> */}
    <div>
      <input {...input} placeholder={label} type={type} className='songRequestFormText' />
      {touched && error && <span className='songRequestFormError'>{error}</span>}
    </div>
  </div>
);

let SongRequestForm = (props) => {
  const { error, handleSubmit, pristine, reset, submitting, pointsTotal, valid } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Field name='youtube_url' component={renderField} type='text' className='SongRequestFormText' label='Youtube URL' />
      </div>
      <div>
        <label htmlFor='use_priority'>Make Request Priority?  (+500pts)</label>
        <Field name='use_priority' component='input' type='checkbox' />
      </div>
      <div>
        <label htmlFor='instrument'>Select Instrument (+500pts)</label>
        <div>
          <Field name='instrument' component={renderField} type='text' class='SongRequestFormText' label='pick any instrument' />
        </div>
      </div>
      <p>
        You have {props.creditBalance} request credits.
        <span className='songRequestFormError'>
          {
            pointsTotal > props.creditBalance
            ? 'Looks like you need more!'
            : ''}
        </span>
      </p>
      <button className='button-secondary' type='submit' disabled={pristine || submitting || !valid || (pointsTotal > props.creditBalance)}>Submit for {pointsTotal} points</button>
      <button className='button-secondary' type='button' disabled={pristine || submitting} onClick={reset}>Clear Values</button>
    </form>
  );
};

// // Decorate the form component
SongRequestForm = reduxForm({
  form: 'songrequest', // a unique name for this form
  validate
})(SongRequestForm);

const selector = formValueSelector('songrequest'); // <-- same as form name
SongRequestForm = connect(
  (state) => {
    // can select values individually
    var pointsTotal = 0;
    if (selector(state, 'use_priority')) {
      pointsTotal += 500;
    }
    let instrument = selector(state, 'instrument');
    if (instrument !== '' && instrument !== undefined) {
      pointsTotal += 500;
    }
    return {
      pointsTotal
    };
  }
)(SongRequestForm);

export default SongRequestForm;
// export default reduxForm({
//   form: 'songrequest',
//   validate
// })(SongRequestForm)
