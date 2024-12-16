import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const Form = forwardRef((props, ref) => {
  const { initialValues, enableReinitialize, onSubmit, children, onReset, id, width } = props;

  return (
    <ScrollView contentContainerStyle={[styles.container, { width: width || '100%', marginBottom:15 }]}>
      <Formik
        innerRef={ref} // Forward ref to Formik instance
        initialValues={initialValues}
        enableReinitialize={enableReinitialize}
        onSubmit={onSubmit}
        onReset={onReset}
        id={id}
      >
        {() => (
          <View>
            {children}
          </View>
        )}
      </Formik>
    </ScrollView>
  );
});

Form.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  enableReinitialize: PropTypes.bool,
  onReset: PropTypes.func,
  children: PropTypes.node.isRequired,
  id: PropTypes.string,
  width: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Form;
