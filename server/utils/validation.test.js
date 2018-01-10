const expect = require('expect');

const {
    isRealString
} = require('./validation');

describe('Join Page Data Validation', () => {
    test('should reject non-string values', () => {
        const val = isRealString(100);
        expect(val).toBe(false);
    });

    test('should reject string with only spaces', () => {
        const val = isRealString('            ');
        expect(val).toBe(false);
    });

    test('should allow string with non-space characters', () => {
        const val = isRealString('Hey there!');
        expect(val).toBe(true);
    });
});