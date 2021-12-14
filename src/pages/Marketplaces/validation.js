import * as yup from 'yup';

export const MarketplaceSchema = yup.object().shape({
  name: yup.string().min(2, 'Too Short!').required('Required'),
  description: yup.string().min(2, 'Too Short!').max(150, 'Maximum of 150 characters').required('Required'),
  avatarImage: yup.array().required('Required'),
  backgroundImage: yup.array().required('Required'),
});

export const MarketplaceResellSchema = yup.object().shape({
  price: yup.number().required('Required').moreThan(0),
  startDate: yup.date().min(new Date(), 'Date must be later than today.'),
  endDate: yup
    .date()
    .default(null)
    .when('startDate', (startDate, yup) => startDate && yup.min(startDate, 'End time cannot be before start time.')),
});
