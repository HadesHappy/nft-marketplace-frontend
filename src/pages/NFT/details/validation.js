import * as yup from 'yup';

const BidSchema = yup.object().shape({
  bid: yup.number().required('Required').moreThan(0),
});

export default BidSchema;
