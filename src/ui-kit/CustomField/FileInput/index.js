import { Box, Text } from '@chakra-ui/react';
import { getIn } from 'formik';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import {
  DeleteIcon,
  Thumb,
  ThumbImage,
  ThumbInner,
  ThumbsContainer,
  ThumbWrapper,
  Upload,
  UploadContainer,
  WrapInfo,
} from './styled-ui';

const CustomFileInput = (props) => {
  const { field, form, accept, label, actionText, maxFiles, labelTypes, onChange } = props;
  const { name } = field;

  const error = getIn(form.errors, name);
  const isTouched = getIn(form.touched, name);
  const isError = !!error && isTouched;

  const [files, setFiles] = React.useState([]);
  const { getRootProps, getInputProps, open } = useDropzone({
    accept,
    noClick: true,
    maxSize: 100000000,
    maxFiles: maxFiles,
    onDrop: (acceptedFiles) => {
      const filesUpload = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setFiles(files.concat(filesUpload));
      form.setFieldValue(field.name, files.concat(filesUpload));
      if (onChange) {
        onChange(filesUpload);
      }
    },
  });

  const deleteImage = (index) => {
    files.splice(index, 1);
    setFiles(files);
    form.setFieldValue(field.name, files);
  };

  const thumbs = files.map((file, index) => (
    <ThumbWrapper key={index}>
      <DeleteIcon onClick={() => deleteImage(index)} />

      <Thumb key={file.name}>
        <ThumbInner>
          <ThumbImage src={file.preview} alt="" />
        </ThumbInner>
      </Thumb>
    </ThumbWrapper>
  ));

  React.useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <>
      <Box>
        <Text mb="8px" color="gray.500">
          {label}
        </Text>
        <UploadContainer {...getRootProps({ className: 'dropzone' })} isError={isError}>
          <input id={name} name={name} {...getInputProps()} />
          <WrapInfo>
            <Upload onClick={open}>
              <Text color="teal.200" textAlign="center">
                {actionText ?? 'Click to upload file'}{' '}
              </Text>
            </Upload>
            <Text align="center">{labelTypes ? labelTypes : 'JPG, JPEG, PNG, GIF, WEBP, MP4. Max 100mb.'}</Text>
          </WrapInfo>

          <ThumbsContainer>{thumbs}</ThumbsContainer>
        </UploadContainer>
      </Box>
    </>
  );
};

export default CustomFileInput;
