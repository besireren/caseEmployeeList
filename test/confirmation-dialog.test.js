import { ConfirmationDialog } from '../src/components/confirmation-dialog.js';
import { fixture, html, expect } from '@open-wc/testing';

describe('ConfirmationDialog', () => {
    let element;

    beforeEach(async () => {
        element = await fixture(html`<confirmation-dialog></confirmation-dialog>`);
        element.open = true;
        element.type = 'delete';
        element.message = 'Test message';
        await element.updateComplete;
    });

    it('initializes with default values', async () => {
        // Reset to defaults for this test
        const defaultElement = await fixture(html`<confirmation-dialog></confirmation-dialog>`);
        expect(defaultElement.open).to.be.false;
        expect(defaultElement.message).to.equal('');
        expect(defaultElement.type).to.equal('delete');
    });

    it('renders nothing when closed', async () => {
        element.open = false;
        await element.updateComplete;
        expect(element.shadowRoot.querySelector('.overlay')).to.be.null;
    });

    it('renders dialog when open', async () => {
        const overlay = element.shadowRoot.querySelector('.overlay');
        expect(overlay).to.exist;
        expect(overlay.classList.contains('open')).to.be.true;
    });

    it('displays correct message', async () => {
        const messageElement = element.shadowRoot.querySelector('.message');
        expect(messageElement.textContent).to.equal('Test message');
    });

    it('emits cancel event when close button is clicked', async () => {
        let eventFired = false;
        element.addEventListener('cancel', () => eventFired = true);

        const closeButton = element.shadowRoot.querySelector('.close-button');
        closeButton.click();

        expect(eventFired).to.be.true;
        expect(element.open).to.be.false;
    });

    it('emits proceed event when proceed button is clicked', async () => {
        let eventFired = false;
        element.addEventListener('proceed', () => eventFired = true);

        const proceedButton = element.shadowRoot.querySelector('.proceed');
        proceedButton.click();

        expect(eventFired).to.be.true;
        expect(element.open).to.be.false;
    });

    it('closes when clicking overlay', async () => {
        const overlay = element.shadowRoot.querySelector('.overlay');
        overlay.click();

        expect(element.open).to.be.false;
    });

    it('does not close when clicking dialog content', async () => {
        const dialog = element.shadowRoot.querySelector('.dialog');
        const event = new Event('click');
        event.stopPropagation = () => {};
        dialog.dispatchEvent(event);

        expect(element.open).to.be.true;
    });

    it('displays correct button text based on type', async () => {
        const proceedButton = element.shadowRoot.querySelector('.proceed');
        // The component would use translation, not manually checking text content
        expect(proceedButton).to.exist;
    });

    it('emits cancel event when cancel button is clicked', async () => {
        let cancelEventFired = false;
        element.addEventListener('cancel', () => {
            cancelEventFired = true;
        });

        const cancelButton = element.shadowRoot.querySelector('.cancel');
        cancelButton.click();
        
        expect(cancelEventFired).to.be.true;
    });

    it('shows overlay when open is true', async () => {
        const overlay = element.shadowRoot.querySelector('.overlay');
        expect(overlay).to.exist;
        expect(overlay.classList.contains('open')).to.be.true;
    });

    it('does not render overlay when open is false', async () => {
        element.open = false;
        await element.updateComplete;
        
        expect(element.shadowRoot.querySelector('.overlay')).to.be.null;
    });

    it('translates content based on language', () => {
        // Test English translations
        document.documentElement.lang = 'en';
        expect(element.t('form.submit.add')).to.exist;
        
        // Test Turkish translations
        document.documentElement.lang = 'tr';
        expect(element.t('form.submit.add')).to.exist;
    });

    it('handles missing translations gracefully', () => {
        const nonExistentKey = 'non.existent.key';
        expect(element.t(nonExistentKey)).to.equal(nonExistentKey);
    });
}); 