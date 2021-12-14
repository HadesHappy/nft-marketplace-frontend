import { extendTheme } from '@chakra-ui/react';

export const customTheme = extendTheme({
  colors: {
    teal: {
      200: '#00FFD1',
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '400',
        fontFamily: 'SpaceMono',
      },
      sizes: {
        xl: {
          h: '56px',
          fontSize: 'lg',
          px: '32px',
        },
      },
      variants: {
        'with-shadow': {
          bg: 'teal.200',
          boxShadow: '0px 4px 24px rgba(0, 255, 209, 0.54)',
        },
        'solid-bg': {
          bg: 'teal.200',
        },
        solid: (props) => ({
          bg: 'teal.200',
        }),
      },
    },
    Checkbox: {
      variants: {
        'with-shadow': {
          bg: 'teal.200',
          boxShadow: '0px 4px 24px rgba(0, 255, 209, 0.54)',
        },
        'solid-bg': {
          bg: 'teal.200',
        },
        solid: (props) => ({
          bg: 'teal.200',
        }),
      },
    },
  },
});
