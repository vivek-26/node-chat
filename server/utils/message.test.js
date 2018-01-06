// Test Dependencies
const expect = require('expect');
const {
    generateMessage,
    generateLocationMessage
} = require('./message');

describe('Generate Message', () => {
    test('should generate correct message object', () => {
        const from = 'Jen';
        const text = 'Chat Application';
        const message = generateMessage(from, text);

        expect(message).toMatchObject({
            from,
            text
        });
    });
});

describe('Generate Location Message', () => {
    it('should generate correct location object', () => {
        const from = 'Andrea';
        const latitude = 1;
        const longitude = 1;
        const locationMessage = generateLocationMessage(from, latitude, longitude);

        expect(typeof locationMessage.from).toBe('string');
        expect(typeof locationMessage.url).toBe('string');
        expect(locationMessage.url).toBe('https://www.google.com/maps?q=1,1');
    });
});