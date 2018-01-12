const expect = require('expect');

const {
    Users
} = require('./users');

describe('Users', () => {
    var usersTest;
    beforeEach(() => {
        usersTest = new Users();
        usersTest.users = [{
                'id': '1',
                'name': 'Mike',
                'room': 'Node Course'
            },
            {
                'id': '2',
                'name': 'Jen',
                'room': 'React Course'
            }, {
                'id': '3',
                'name': 'Julie',
                'room': 'Node Course'
            }
        ];
    });

    test('should add new user', () => {
        const users = new Users();
        const user = {
            'id': '123',
            'name': 'Andrew',
            'room': 'The Office Fans'
        };

        var resUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    test('should remove a user', () => {
        const userId = '2';
        const user = usersTest.removeUser(userId);

        expect(user.id).toBe(userId);
        expect(usersTest.users.length).toBe(2);
    });

    test('it should not remove user', () => {
        const userId = '149';
        const user = usersTest.removeUser(userId);

        expect(user).toBe(undefined);
        expect(usersTest.users.length).toBe(3);
    });

    test('should find user', () => {
        const userId = '3';
        const user = usersTest.getUser(userId);

        expect(user.id).toBe(userId);
    });

    test('it should not find user', () => {
        const userId = '99';
        const user = usersTest.getUser(userId);

        expect(user).toBe(undefined);
    });

    test('should return names for node course', () => {
        const userList = usersTest.getUserList('Node Course');

        expect(userList).toEqual(['Mike', 'Julie']);
    });

    test('should return names for react course', () => {
        const userList = usersTest.getUserList('React Course');

        expect(userList).toEqual(['Jen']);
    });
});