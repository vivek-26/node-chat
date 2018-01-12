// User Class
class Users {
    constructor() {
        this.users = [];
    }

    // Add user
    addUser(id, name, room) {
        const user = {
            id,
            name,
            room
        };
        this.users.push(user);
        return user;
    }

    // Remove a user - return the removed user
    removeUser(id) {
        const user = this.getUser(id);
        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }
        return user;
    }

    // Get a user
    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }

    // Get a list of users by room
    getUserList(room) {
        const users = this.users.filter((user) => user.room === room);
        const names = users.map((user) => user.name);
        return names;
    }
}

module.exports = {
    Users
};