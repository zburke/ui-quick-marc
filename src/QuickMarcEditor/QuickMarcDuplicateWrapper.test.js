import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
  act,
  render,
  cleanup,
  fireEvent,
} from '@testing-library/react';
import faker from 'faker';
import noop from 'lodash/noop';

import '@folio/stripes-acq-components/test/jest/__mock__';

import QuickMarcDuplicateWrapper from './QuickMarcDuplicateWrapper';
import { QUICK_MARC_ACTIONS } from './constants';

jest.mock('react-final-form', () => ({
  ...jest.requireActual('react-final-form'),
  FormSpy: jest.fn(() => (<span>FormSpy</span>)),
}));

const mockFormValues = jest.fn(() => ({
  fields: undefined,
  externalId: '17064f9d-0362-468d-8317-5984b7efd1b5',
  leader: '02949cama2200517Kii50000',
  parsedRecordDtoId: '1bf159d9-4da8-4c3f-9aac-c83e68356bbf',
  parsedRecordId: '1bf159d9-4da8-4c3f-9aac-c83e68356bbf',
  records: [
    {
      tag: 'LDR',
      content: '02949cama2200517Kii50000',
      id: 'LDR',
    }, {
      tag: '001',
      content: '',
      indicators: [],
      id: '595a98e6-8e59-448d-b866-cd039b990423',
    }, {
      tag: '008',
      content: {
        Audn: '\\',
        BLvl: 'm',
        Biog: '\\',
        Conf: '0',
        Cont: ['b', '\\', '\\', '\\'],
        Ctry: 'miu',
        Date1: '2009',
        Date2: '\\\\',
        Desc: 'i',
        DtSt: 's',
        ELvl: 'i',
        Entered: '130325',
        Fest: '0',
        Form: 'o',
        GPub: '\\',
        Ills: ['\\', '\\', '\\', '\\'],
        Indx: '1',
        Lang: 'eng',
        LitF: '0',
        MRec: '\\',
        Srce: 'd',
        Type: 'a',
      },
      indicators: [],
      id: '93213747-46fb-4861-b8e8-8774bf4a46a4',
    }, {
      tag: '050',
      content: '$a BS1545.53 $b .J46 2009eb',
      indicators: [],
      id: '6abdaf9b-ac58-4f83-9687-73c939c3c21a',
    }, {
      content: '$a (derived2)/Ezekiel / $c Robert W. Jenson.',
      id: '5aa1a643-b9f2-47e8-bb68-6c6457b5c9c5',
      indicators: ['1', '0'],
      tag: '245',
    }, {
      tag: '999',
      content: '',
      indicators: [],
      id: '4a844042-5c7e-4e71-823e-599582a5d7ab',
    },
  ],
  suppressDiscovery: false,
  updateInfo: { recordState: 'NEW' },
}));

jest.mock('@folio/stripes/final-form', () => () => (Component) => ({ onSubmit, ...props }) => {
  const formValues = mockFormValues();

  return (
    <Component
      handleSubmit={() => onSubmit(formValues)}
      form={{
        mutators: {},
        reset: jest.fn(),
      }}
      {...props}
    />
  );
});

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  ConfirmationModal: jest.fn(({
    open,
    onCancel,
    onConfirm,
  }) => (open ? (
    <div>
      <span>Confirmation modal</span>
      <button
        type="button"
        onClick={onCancel}
      >
        Close
      </button>
      <button
        type="button"
        onClick={onConfirm}
      >
        Keep editing
      </button>
    </div>
  ) : null)),
}));

const mockShowCallout = jest.fn();

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useShowCallout: jest.fn(() => mockShowCallout),
}));

jest.mock('./QuickMarcEditorRows', () => {
  return {
    QuickMarcEditorRows: () => (<span>QuickMarcEditorRows</span>),
  };
});

jest.mock('./QuickMarcRecordInfo', () => {
  return {
    QuickMarcRecordInfo: () => <span>QuickMarcRecordInfo</span>,
  };
});

jest.mock('./constants', () => ({
  ...jest.requireActual('./constants'),
  QM_RECORD_STATUS_TIMEOUT: 5,
  QM_RECORD_STATUS_BAIL_TIME: 20,
}));

const getInstance = () => ({
  id: faker.random.uuid(),
  title: 'ui-quick-marc.record.edit.title',
});

const record = {
  id: faker.random.uuid(),
  leader: faker.random.uuid(),
  fields: [],
};

const renderQuickMarcDuplicateWrapper = ({
  instance,
  onClose = noop,
  mutator,
  history,
  location,
}) => (render(
  <MemoryRouter>
    <QuickMarcDuplicateWrapper
      onClose={onClose}
      instance={instance}
      mutator={mutator}
      action={QUICK_MARC_ACTIONS.DUPLICATE}
      initialValues={{ leader: 'assdfgs ds sdg' }}
      history={history}
      location={location}
    />
  </MemoryRouter>,
));

describe('Given QuickMarcDuplicateWrapper', () => {
  let mutator;
  let instance;
  let history;
  let location;

  beforeEach(() => {
    instance = getInstance();
    mutator = {
      quickMarcEditInstance: {
        GET: () => Promise.resolve(instance),
      },
      quickMarcEditMarcRecord: {
        GET: jest.fn(() => Promise.resolve(record)),
        POST: jest.fn(() => Promise.resolve({})),
      },
      quickMarcRecordStatus: {
        GET: jest.fn(() => Promise.resolve({})),
      },
    };
    history = {
      push: jest.fn(),
    };
    location = {
      search: '?filters=source.MARC',
    };
  });

  afterEach(cleanup);

  describe('when click on cancel pane button', () => {
    const onClose = jest.fn();

    it('should display pane footer', () => {
      const { getByText } = renderQuickMarcDuplicateWrapper({
        instance,
        mutator,
        history,
        onClose,
        location,
      });

      fireEvent.click(getByText('stripes-acq-components.FormFooter.cancel'));

      expect('Confirmation modal').toBeDefined();
    });
  });

  describe('when click on save button', () => {
    it('should show on save message and redirect on load page', async () => {
      let getByText;

      await act(async () => {
        getByText = renderQuickMarcDuplicateWrapper({
          instance,
          mutator,
          history,
          location,
        }).getByText;
      });

      await fireEvent.click(getByText('stripes-acq-components.FormFooter.save'));

      expect(mockShowCallout).toHaveBeenCalledWith({ messageId: 'ui-quick-marc.record.saveNew.onSave' });

      await new Promise(resolve => {
        setTimeout(() => {
          expect(history.push).toHaveBeenCalledWith({
            pathname: '/inventory/view/id',
            search: location.search,
          });

          resolve();
        }, 10);
      });
    }, 100);

    describe('when there is an error during POST request', () => {
      it('should show an error message', async () => {
        let getByText;

        await act(async () => {
          getByText = renderQuickMarcDuplicateWrapper({
            instance,
            mutator,
            history,
            location,
          }).getByText;
        });

        mutator.quickMarcEditMarcRecord.POST = jest.fn(() => Promise.reject());

        await fireEvent.click(getByText('stripes-acq-components.FormFooter.save'));

        expect(mutator.quickMarcEditMarcRecord.POST).toHaveBeenCalled();

        await new Promise(resolve => {
          setTimeout(() => {
            expect(mockShowCallout).toHaveBeenCalledWith({
              messageId: 'ui-quick-marc.record.save.error.generic',
              type: 'error',
            });

            resolve();
          }, 10);
        });
      }, 100);
    });
  });
});
