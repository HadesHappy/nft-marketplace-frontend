import * as yup from 'yup';

const CollectionSchema = yup.object().shape({
  collectionName: yup.string().min(2, 'Too Short!').required('Required'),
  collectionDescription: yup.string().min(2, 'Too Short!').max(300, 'Maximum of 300 characters').required('Required'),
  collectionImage: yup.array().required('Required'),
  symbol: yup.string().required('Required'),
});

export default CollectionSchema;
