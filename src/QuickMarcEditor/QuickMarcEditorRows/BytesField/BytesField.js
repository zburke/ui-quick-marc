import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage } from 'react-intl';

import {
  Label,
  TextField,
  Select,
} from '@folio/stripes/components';

import { FIXED_FIELD_MAX_LENGTH } from '../../../common/constants';

import styles from './BytesField.css';

export const SUBFIELD_TYPES = {
  BYTE: 'Byte',
  STRING: 'String',
  BYTES: 'Bytes',
  SELECT: 'Select',
};

const renderSubField = (name, config) => {
  const fieldName = `${name}.${config.name}`;
  const label = <FormattedMessage id={`ui-quick-marc.record.fixedField.${config.name}`} />;

  if (config.type === SUBFIELD_TYPES.BYTES) {
    return (
      <FieldArray name={fieldName}>
        {() => {
          return (
            <div className={styles.bytesFieldSubFieldBytes}>
              <Label htmlFor={`${fieldName}[0]`}>
                {label}
              </Label>

              <div className={styles.bytesFieldSubFieldBytesList}>
                {
                  Array.from(Array(config.bytes)).map((v, idx) => {
                    return (
                      <FormattedMessage
                        key={idx}
                        id={`ui-quick-marc.record.fixedField.${config.name}`}
                      >
                        {ariaLabel => (
                          <Field
                            dirty={false}
                            ariaLabel={ariaLabel}
                            name={`${fieldName}[${idx}]`}
                            component={TextField}
                            maxlength={FIXED_FIELD_MAX_LENGTH}
                            disabled={config.disabled}
                            className={styles.fixedFieldSubFieldByte}
                            hasClearIcon={false}
                            data-testid={`fixed-field-${config.type}`}
                            parse={value => value || '\\'}
                            defaultValue=""
                          />
                        )}
                      </FormattedMessage>
                    );
                  })
                }
              </div>
            </div>
          );
        }}
      </FieldArray>
    );
  }

  if (config.type === SUBFIELD_TYPES.SELECT) {
    return (
      <div className={styles.bytesFieldSubFieldSelect}>
        <FormattedMessage id={`ui-quick-marc.record.fixedField.${config.name}`}>
          {ariaLabel => (
            <Field
              dirty={false}
              ariaLabel={ariaLabel}
              name={fieldName}
              label={label}
              component={Select}
              disabled={config.disabled}
              dataOptions={config.options}
              data-testid={`fixed-field-${config.type}`}
            />
          )}
        </FormattedMessage>
      </div>
    );
  }

  const getMaxLengthByType = config.type === SUBFIELD_TYPES.BYTE ? FIXED_FIELD_MAX_LENGTH : undefined;

  return (
    <FormattedMessage id={`ui-quick-marc.record.fixedField.${config.name}`}>
      {ariaLabel => (
        <Field
          dirty={false}
          ariaLabel={ariaLabel}
          name={fieldName}
          label={label}
          component={TextField}
          disabled={config.disabled}
          maxlength={getMaxLengthByType}
          className={styles[`bytesFieldSubField${config.type}`]}
          hasClearIcon={false}
          data-testid={`fixed-field-${config.type}`}
        />
      )}
    </FormattedMessage>
  );
};

export const BytesField = ({ config, name, id }) => {
  return (
    <div
      className={styles.bytesFieldRow}
      data-testid={id || `row-${name}`}
    >
      {
        config.fields.map((field, fieldIdx) => {
          return (
            <div
              key={fieldIdx}
              data-testid="bytes-field-col"
            >
              {renderSubField(name, field)}
            </div>
          );
        })
      }
    </div>
  );
};

BytesField.propTypes = {
  name: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  id: PropTypes.string,
};

BytesField.defaultProps = {
  id: '',
};
