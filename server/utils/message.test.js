// Test Dependencies
const expect = require('expect');
const {
    generateMessage
} = require('./message');

describe('Generate Message', () => {
    test('should generate correct message object', () => {
        const from = 'Jen';
        const text = 'Chat Application';
        const message = generateMessage(from, text);

        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({
            from,
            text
        });
    });
});