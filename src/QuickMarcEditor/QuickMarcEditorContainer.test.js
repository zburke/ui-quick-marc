import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup, act, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import faker from 'faker';

import '@folio/stripes-acq-components/test/jest/__mock__';

import QuickMarcEditorContainer from './QuickMarcEditorContainer';

const getInstance = () => ({
  id: faker.random.uuid(),
  title: faker.lorem.sentence(),
});

const match = {
  params: {
    instanceId: faker.random.uuid(),
  },
};

const renderQuickMarcEditorContainer = ({ onClose, mutator }) => (render(
  <IntlProvider locale="en">
    <MemoryRouter>
      <QuickMarcEditorContainer
        onClose={onClose}
        match={match}
        mutator={mutator}
      />
    </MemoryRouter>
  </IntlProvider>,
));

describe('Given Quick Marc Editor Container', () => {
  let mutator;
  let instance;

  beforeEach(() => {
    instance = getInstance();
    mutator = {
      quickMarcEditInstance: {
        GET: () => Promise.resolve(instance),
      },
    };
  });

  afterEach(cleanup);

  it('Than it should display Quick Marc Editor with fetched instance', async () => {
    let getByText;

    await act(async () => {
      const renderer = await renderQuickMarcEditorContainer({ mutator, onClose: jest.fn() });

      getByText = renderer.getByText;
    });

    expect(getByText(instance.title)).toBeDefined();
  });

  describe('When close button is pressed', () => {
    it('Than it should invoice onCancel', async () => {
      let getByText;
      const onClose = jest.fn();

      await act(async () => {
        const renderer = await renderQuickMarcEditorContainer({ mutator, onClose });

        getByText = renderer.getByText;
      });

      const closeButton = getByText('stripes-acq-components.FormFooter.cancel');

      expect(onClose).not.toHaveBeenCalled();

      fireEvent(closeButton, new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }));

      expect(onClose).toHaveBeenCalled();
    });
  });
});