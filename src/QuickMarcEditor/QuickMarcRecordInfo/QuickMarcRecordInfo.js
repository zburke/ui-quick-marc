import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';

import {
  FormattedDate,
  FormattedTime,
} from '@folio/stripes/components';

import {
  RECORD_STATUS_CURRENT,
  RECORD_STATUS_LABELS,
} from './constants';

import styles from './QuickMarcRecordInfo.css';
import { MARC_TYPES } from '../../common/constants';

export const QuickMarcRecordInfo = ({
  isEditAction,
  status,
  updateDate,
  updatedBy,
  marcType,
  correspondingMarcTag,
}) => {
  const getSourceLabel = () => {
    const source = updatedBy
      ? `${updatedBy.lastName}, ${updatedBy.firstName}`
      : <FormattedMessage id="ui-quick-marc.meta.source.system" />;

    return (
      <>
        <span>&nbsp;&bull;&nbsp;</span>
        <FormattedMessage
          id="stripes-components.metaSection.source"
          values={{ source }}
        />
      </>
    );
  };

  return (
    <div
      className={styles.quickMarcRecordInfoWrapper}
      data-test-quick-marc-record-info
    >
      {marcType === MARC_TYPES.AUTHORITY && (
        <>
          <span>&nbsp;&bull;&nbsp;</span>
          <FormattedMessage id={`ui-quick-marc.record.headingType.${correspondingMarcTag}`} />
        </>
      )}
      <span>
        <FormattedMessage id="ui-quick-marc.record.status" />
      </span>
      {RECORD_STATUS_LABELS[status]}
      {
        Boolean(updateDate) && (
          <>
            <span>&nbsp;&bull;&nbsp;</span>
            <FormattedMessage
              id="ui-quick-marc.record.lastUpdated"
              values={{
                date: <FormattedDate value={updateDate} />,
                time: <FormattedTime value={updateDate} />,
              }}
            />
          </>
        )
      }
      {isEditAction && getSourceLabel()}
    </div>
  );
};

QuickMarcRecordInfo.propTypes = {
  correspondingMarcTag: PropTypes.string,
  isEditAction: PropTypes.bool.isRequired,
  status: PropTypes.string,
  updateDate: PropTypes.string,
  updatedBy: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
};

QuickMarcRecordInfo.defaultProps = {
  correspondingMarcTag: '',
  status: RECORD_STATUS_CURRENT,
};
