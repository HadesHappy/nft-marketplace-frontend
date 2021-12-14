import { Text } from '@chakra-ui/react';
import { getIn } from 'formik';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './date-picker.css';

const DatePickerField = ({ field, form, label, description, onBlur, setFieldValue, ...props }) => {
  const { name, value, ...fieldProps } = field;

  const error = getIn(form.errors, name);
  const isTouched = getIn(form.touched, name);
  const isError = !!error && isTouched;

  const onChange = (event) => {
    setFieldValue(name, event);
  };

  return (
    <>
      <Text mb="8px" color="gray.500">
        {' '}
        {label}
      </Text>
      <DatePicker
        {...fieldProps}
        selected={value}
        onChange={onChange}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={20}
        timeCaption="time"
        dateFormat="dd.MM.yyyy H:mm"
        minDate={new Date()}
        // maxDate={addDays(new Date(), 7)}
      />
    </>
  );
};

export default DatePickerField;
