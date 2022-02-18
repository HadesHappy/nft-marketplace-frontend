import * as yup from 'yup';

export const NftSchema = yup.object().shape({
  name: yup.string().min(2, 'Minimum of 2 characters').max(25, 'Maximum of 25 characters').required('Required'),
  description: yup
    .string()
    .min(30, 'Minimum of 30 characters')
    .max(400, 'Maximum of 400 characters')
    .required('Required'),
  isPublishNow: yup.boolean(),
  isVideoNFT: yup.boolean(),
  nftCover: yup.array().when('isVideoNFT', {
    is: true,
    // .test('len', 'Required', (val) => val.length > 0)
    then: yup.array().required('Required'),
  }),
  nftError: yup.boolean().oneOf([false], 'Incorrect file.'),

  price: yup.number().when('isPublishNow', {
    is: true,
    then: yup.number().required('Required').moreThan(0),
  }),
  nftImage: yup.array().required('Required'),
  collectionAddress: yup.string().required('Required'),

  startDate: yup.date().when('isPublishNow', {
    is: true,
    then: yup.date().min(new Date(), 'Date must be later than today.'),
  }),
  endDate: yup
    .date()
    .default(null)
    .when('isPublishNow', {
      is: true,
      then: yup
        .date()
        .when(
          'startDate',
          (startDate, yup) => startDate && yup.min(startDate, 'End time cannot be before start time.')
        ),
    }),
});

export const NftResellSchema = yup.object().shape({
  price: yup.number().required('Required').moreThan(0),
  startDate: yup.date().min(new Date(), 'Date must be later than today.'),
  endDate: yup
    .date()
    .default(null)
    .when('startDate', (startDate, yup) => startDate && yup.min(startDate, 'End time cannot be before start time.')),
});
